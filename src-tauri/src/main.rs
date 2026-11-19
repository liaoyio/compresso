// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::sync::Mutex;
use tauri::Emitter;
use tauri::Manager;
use tauri::State;
use tauri_plugin_fs::FsExt;

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
            take_opened_files
        ])
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|app_handle, event| match event {
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
