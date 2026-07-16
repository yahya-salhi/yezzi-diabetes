import * as Sharing from "expo-sharing";

type DispatchOptions = {
  mimeType: string;
  UTI?: string;
  dialogTitle: string;
};

export async function dispatchDocument(
  uri: string,
  options: DispatchOptions,
): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error("Sharing is not available on this device.");
  }

  await Sharing.shareAsync(uri, {
    mimeType: options.mimeType,
    UTI: options.UTI,
    dialogTitle: options.dialogTitle,
  });
}
