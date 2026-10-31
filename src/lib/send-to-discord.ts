export const sendToDiscord = async (fields: Record<string, string>[]) => {
  try {
    await fetch("https://tools.rotato.app/api/discord/surveys", {
      method: "POST",
      body: JSON.stringify(fields),
    });
  } catch (error) {
    console.error(error);
  }
};
