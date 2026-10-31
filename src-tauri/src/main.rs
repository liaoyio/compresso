// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use showfile;
use std::process::Command;
use std::sync::{Arc, Mutex};
use tauri::process::restart;
use tauri::Emitter;
use tauri::Manager;
use tauri::State;
use tauri_plugin_fs::FsExt;
use tauri_plugin_log::{Target, TargetKind};
use tauri_plugin_updater::UpdaterExt;

struct UpdateState {
    wants_update: Mutex<bool>,
    downloaded: Arc<Mutex<Vec<u8>>>,
    download_done: Arc<Mutex<bool>>,
}

struct OpenedFilesState {
    inner: Mutex<OpenedFilesInner>,
}

struct OpenedFilesInner {
    paths: Vec<String>,
    frontend_ready: bool,
}

fn main() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .setup(|app| {
            #[cfg(desktop)]
            let updater = tauri_plugin_updater::Builder::new().build();
            app.handle().plugin(updater)?;
            Ok(())
        })
        .manage(UpdateState {
            wants_update: Mutex::new(false),
            downloaded: Default::default(),
            download_done: Arc::new(Mutex::new(false)),
        })
        .manage(OpenedFilesState {
            inner: Mutex::new(OpenedFilesInner {
                paths: Vec::new(),
                frontend_ready: false,
            }),
        })
        .invoke_handler(tauri::generate_handler![
            expand_scope,
            show_in_folder,
            open_file,
            restart_app,
            wants_update_on_exit,
            take_opened_files
        ])
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|app_handle, event| match event {
        tauri::RunEvent::ExitRequested { api, .. } => {
            println!("app is about to exit! checking if we should install an update");

            let update_state = app_handle.state::<UpdateState>();
            let mut should_install_update = update_state.wants_update.lock().unwrap();
            let download_done_lock = update_state.download_done.lock().unwrap();
            if *should_install_update == true && *download_done_lock == true {
                api.prevent_exit();
                println!("trying to install an update");
                let handle = app_handle.clone();
                tauri::async_runtime::spawn(async move {
                    update(handle).await;
                    std::process::exit(0x0);
                });
                *should_install_update = false;
            } else {
                std::process::exit(0x0);
            }
        }
        #[cfg(target_os = "macos")]
        tauri::RunEvent::Opened { urls } => {
            let paths = urls
                .into_iter()
                .filter_map(|url| url.to_file_path().ok())
                .map(|path| path.to_string_lossy().to_string())
                .collect::<Vec<_>>();

            if !paths.is_empty() {
                let opened_files_state = app_handle.state::<OpenedFilesState>();
                let paths_to_emit = {
                    let mut state = opened_files_state.inner.lock().unwrap();
                    if state.frontend_ready {
                        Some(paths)
                    } else {
                        state.paths.extend(paths);
                        None
                    }
                };

                if let Some(paths) = paths_to_emit {
                    let _ = app_handle.emit("opened-files", paths);
                }
            }
        }
        _ => {}
    })
    // compresso_lib::run()
}

async fn update(app: tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(update) = app.updater()?.check().await? {
        let update_state = app.state::<UpdateState>();
        let mut downloaded = update_state.downloaded.lock().unwrap();

        update.install(downloaded.clone());
        downloaded.clear();

        println!("update installed");
    }

    Ok(())
}

async fn download_update(app: tauri::AppHandle) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    if let Some(update) = app.updater()?.check().await? {
        let mut bytes_downloaded = 0;

        let downloaded = update
            .download(
                |chunk_length, content_length| {
                    bytes_downloaded += chunk_length;
                    //   println!("downloaded {bytes_downloaded} from {content_length:?}");
                },
                || {
                    println!("download finished");
                },
            )
            .await?
            .to_vec();

        Ok(downloaded) // Return the downloaded bytes if an update is available
    } else {
        Ok(vec![])
    }
}

#[tauri::command]
fn expand_scope(app_handle: tauri::AppHandle, folder_path: std::path::PathBuf) {
    // do something to confirm that the request came from the frontend
    // https://github.com/tauri-apps/tauri/discussions/5990#discussioncomment-8233888
    app_handle.fs_scope().allow_directory(&folder_path, true)
}

#[tauri::command]
fn open_file(path: String) {
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", "start", "", &path])
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open").arg(&path).spawn().unwrap();
    }
}

#[tauri::command]
fn take_opened_files(opened_files_state: State<OpenedFilesState>) -> Vec<String> {
    let mut state = opened_files_state.inner.lock().unwrap();
    state.frontend_ready = true;
    std::mem::take(&mut state.paths)
}

#[tauri::command]
fn show_in_folder(path: String) {
    #[cfg(target_os = "windows")]
    {
        showfile::show_path_in_file_manager(path);
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open").args(["-R", &path]).spawn().unwrap();
    }
}

// I really wanted to do this with the process plugin
// but it fails in so many ways
#[tauri::command]
fn restart_app(app_handle: tauri::AppHandle) {
    println!("restarting");
    let update_state = app_handle.state::<UpdateState>();
    let mut should_install_update = update_state.wants_update.lock().unwrap();
    let download_done_lock = update_state.download_done.lock().unwrap();
    if *should_install_update == true && *download_done_lock == true {
        println!("trying to install an update");
        let handle = app_handle.clone();
        let env = app_handle.env().clone();
        tauri::async_runtime::spawn(async move {
            update(handle).await;
            restart(&env);
        });
        *should_install_update = false;
    } else {
        restart(&app_handle.env());
    }
}

#[tauri::command]
fn wants_update_on_exit(update_state: State<UpdateState>, app_handle: tauri::AppHandle) {
    let mut it = update_state.wants_update.lock().unwrap();
    *it = true;

    let handle = app_handle.clone();
    let downloaded_mutex = update_state.downloaded.clone();
    let download_done_mutex = update_state.download_done.clone();
    let result =
        tauri::async_runtime::block_on(async move { download_update(handle).await.unwrap() });

    // Lock and update outside the async block
    let mut downloaded = downloaded_mutex.lock().unwrap();
    *downloaded = result;

    let mut download_done = download_done_mutex.lock().unwrap();
    *download_done = true;
}
