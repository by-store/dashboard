export const DESKTOP_VERSION = "1.2.0";
export const MOBILE_VERSION = "1.2.0";

const DESKTOP_RELEASE_BASE =
  "https://github.com/by-store/desktop/releases/latest/download/";

export const MOBILE_APK_URL =
  "https://github.com/by-store/mobile/releases/latest/download/app-release.apk";
export const MOBILE_RELEASES_URL = "https://github.com/by-store/mobile/releases";
export const DESKTOP_RELEASES_URL = "https://github.com/by-store/desktop/releases";

export type DesktopOs = "win" | "mac" | "linux";

export interface DownloadOption {
  label: string;
  detail: string;
  url: string;
}

export interface DesktopPlatform {
  name: string;
  requirement: string;
  primary: DownloadOption;
  alternatives: DownloadOption[];
  installSteps: string[];
}

const desktopFile = (fileName: string) => `${DESKTOP_RELEASE_BASE}${fileName}`;

export const DESKTOP_PLATFORMS: Record<DesktopOs, DesktopPlatform> = {
  win: {
    name: "Windows",
    requirement: "Windows 10 / 11, 64-bit",
    primary: {
      label: "Unduh untuk Windows",
      detail: "Installer .exe dan .msi dalam satu .zip",
      url: desktopFile("by.store-POS-Windows-64bit.zip"),
    },
    alternatives: [],
    installSteps: [
      "Ekstrak file .zip (klik kanan, Extract All).",
      "Jalankan file Setup .exe lalu ikuti petunjuk instalasi.",
      "Jika muncul SmartScreen, pilih More info lalu Run anyway.",
    ],
  },
  mac: {
    name: "macOS",
    requirement: "macOS 11 ke atas",
    primary: {
      label: "Unduh untuk Mac (Apple Silicon)",
      detail: "Chip M1, M2, M3, M4",
      url: desktopFile("by.store-POS-macOS-Apple-Silicon.zip"),
    },
    alternatives: [
      {
        label: "Mac Intel",
        detail: ".dmg",
        url: desktopFile("by.store-POS-macOS-Intel.zip"),
      },
    ],
    installSteps: [
      "Ekstrak file .zip lalu buka file .dmg.",
      "Seret aplikasi by.store POS ke folder Applications.",
      "Saat pertama dibuka, klik kanan aplikasi lalu pilih Open.",
    ],
  },
  linux: {
    name: "Linux",
    requirement: "Distro 64-bit modern",
    primary: {
      label: "Unduh untuk Linux (AppImage)",
      detail: "Portabel, jalan di hampir semua distro",
      url: desktopFile("by.store-POS-Linux-AppImage.zip"),
    },
    alternatives: [
      {
        label: "Ubuntu / Debian",
        detail: ".deb",
        url: desktopFile("by.store-POS-Linux-DEB.zip"),
      },
      {
        label: "Fedora / RHEL",
        detail: ".rpm",
        url: desktopFile("by.store-POS-Linux-RPM.zip"),
      },
    ],
    installSteps: [
      "Ekstrak file .zip.",
      "AppImage: beri izin eksekusi (chmod +x) lalu jalankan.",
      "Paket .deb / .rpm: instal lewat package manager distro Anda.",
    ],
  },
};

export const MOBILE_INSTALL_STEPS = [
  "Unduh file .apk langsung dari HP Android.",
  "Izinkan instalasi dari sumber tidak dikenal saat diminta.",
  "Buka aplikasi lalu login dengan akun pemilik toko.",
];

export function detectDesktopOs(userAgent: string): DesktopOs {
  if (/Mac/i.test(userAgent) && !/iPhone|iPad/i.test(userAgent)) return "mac";
  if (/Linux/i.test(userAgent) && !/Android/i.test(userAgent)) return "linux";
  return "win";
}

export function isAndroidDevice(userAgent: string): boolean {
  return /Android/i.test(userAgent);
}
