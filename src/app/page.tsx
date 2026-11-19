"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  DESKTOP_PLATFORMS,
  DESKTOP_RELEASES_URL,
  DESKTOP_VERSION,
  MOBILE_APK_URL,
  MOBILE_INSTALL_STEPS,
  MOBILE_RELEASES_URL,
  MOBILE_VERSION,
  detectDesktopOs,
  isAndroidDevice,
  type DesktopOs,
} from "./_landing/downloads";

const DESKTOP_OS_ORDER: DesktopOs[] = ["win", "mac", "linux"];

const DESKTOP_FEATURES = [
  "Operasional penuh lewat keyboard, pintasan F1 sampai F12",
  "Katalog per dimensi dan ketebalan, HPP moving average",
  "Transaksi kredit dengan DP, limit piutang, dan cicilan",
  "Buka dan tutup shift kasir dengan rekap penjualan",
  "Cetak struk thermal 58/80mm dan faktur PDF",
];

const MOBILE_FEATURES = [
  "Omzet harian realtime dari semua kasir",
  "Riwayat nota penjualan per kasir",
  "Ubah stok gudang dan HPP barang",
  "Pantau tagihan jatuh tempo dan catat pelunasan",
];

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" />
    </svg>
  );
}

function InstallSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-5 space-y-2 border-t border-slate-200 pt-5 text-sm text-slate-600">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-3">
          <span className="font-semibold tabular-nums text-slate-900">{index + 1}.</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function useClientEnvironment() {
  const [detectedOs, setDetectedOs] = useState<DesktopOs>("win");
  const [isAndroid, setIsAndroid] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userAgent = `${navigator.userAgent} ${navigator.platform}`;
    setDetectedOs(detectDesktopOs(userAgent));
    setIsAndroid(isAndroidDevice(userAgent));

    createClient()
      .auth.getSession()
      .then(({ data }) => setIsLoggedIn(Boolean(data.session)))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return { detectedOs, isAndroid, isLoggedIn };
}

export default function LandingPage() {
  const { detectedOs, isAndroid, isLoggedIn } = useClientEnvironment();
  const [selectedOs, setSelectedOs] = useState<DesktopOs | null>(null);

  const activeOs = selectedOs ?? detectedOs;
  const platform = DESKTOP_PLATFORMS[activeOs];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icons/icon-192.png" alt="" width={32} height={32} className="rounded" />
            <span className="text-lg font-bold tracking-tight">by.store</span>
          </Link>
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
          >
            {isLoggedIn ? "Buka Dashboard" : "Login Pemilik"}
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:pt-16">
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
            Unduh aplikasi by.store
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            Aplikasi kasir untuk komputer toko, dan aplikasi pemantau untuk HP pemilik. Pilih
            yang Anda butuhkan, gratis untuk akun toko terdaftar.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-5">
            {/* Desktop cashier app */}
            <article
              className={`rounded-xl border border-slate-200 bg-white p-6 md:p-8 lg:col-span-3 ${
                isAndroid ? "order-2" : "order-1"
              }`}
              aria-labelledby="desktop-title"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="desktop-title" className="text-xl font-bold">
                  Kasir Desktop
                </h2>
                <span className="text-sm text-slate-500">Versi {DESKTOP_VERSION}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Untuk komputer atau laptop di meja kasir.
              </p>

              <div
                className="mt-6 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1"
                role="group"
                aria-label="Pilih sistem operasi"
              >
                {DESKTOP_OS_ORDER.map((os) => {
                  const isActive = os === activeOs;
                  return (
                    <button
                      key={os}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setSelectedOs(os)}
                      className={`rounded-md px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900 ${
                        isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {DESKTOP_PLATFORMS[os].name}
                    </button>
                  );
                })}
              </div>
              {activeOs === detectedOs && !isAndroid && (
                <p className="mt-2 text-xs text-slate-500">Sesuai perangkat yang Anda pakai sekarang.</p>
              )}

              <a
                href={platform.primary.url}
                className="mt-5 flex w-full items-center justify-between gap-4 rounded-lg bg-blue-900 px-5 py-4 text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
              >
                <span>
                  <span className="block text-base font-bold">{platform.primary.label}</span>
                  <span className="block text-sm text-blue-100">{platform.primary.detail}</span>
                </span>
                <DownloadIcon />
              </a>

              {platform.alternatives.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {platform.alternatives.map((option) => (
                    <a
                      key={option.url}
                      href={option.url}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
                    >
                      {option.label} <span className="text-slate-500">{option.detail}</span>
                    </a>
                  ))}
                </div>
              )}

              <p className="mt-4 text-xs text-slate-500">Butuh: {platform.requirement}</p>
              <InstallSteps steps={platform.installSteps} />
            </article>

            {/* Mobile owner app */}
            <article
              className={`flex flex-col rounded-xl border border-slate-200 bg-white p-6 md:p-8 lg:col-span-2 ${
                isAndroid ? "order-1" : "order-2"
              }`}
              aria-labelledby="mobile-title"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="mobile-title" className="text-xl font-bold">
                  Mobile Pemilik
                </h2>
                <span className="text-sm text-slate-500">Versi {MOBILE_VERSION}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Untuk HP Android pemilik toko. Pantau toko dari mana saja.
              </p>

              <a
                href={MOBILE_APK_URL}
                className="mt-6 flex w-full items-center justify-between gap-4 rounded-lg bg-slate-900 px-5 py-4 text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                <span>
                  <span className="block text-base font-bold">Unduh untuk Android</span>
                  <span className="block text-sm text-slate-300">File .apk, Android 8.0 ke atas</span>
                </span>
                <DownloadIcon />
              </a>

              {!isAndroid && (
                <p className="mt-3 text-xs text-slate-500">
                  Buka halaman ini dari HP Android agar file langsung terpasang.
                </p>
              )}

              <InstallSteps steps={MOBILE_INSTALL_STEPS} />
            </article>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold">Di Kasir Desktop</h2>
              <ul className="mt-4 space-y-2.5 text-slate-600">
                {DESKTOP_FEATURES.map((feature) => (
                  <li key={feature} className="border-b border-slate-100 pb-2.5">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold">Di Mobile Pemilik</h2>
              <ul className="mt-4 space-y-2.5 text-slate-600">
                {MOBILE_FEATURES.map((feature) => (
                  <li key={feature} className="border-b border-slate-100 pb-2.5">
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-slate-600">
                Data kasir dan HP pemilik tersinkron otomatis lewat satu akun toko.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <span>
            <strong className="text-slate-900">by.store</strong> sistem kasir dan manajemen toko
          </span>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="/PANDUAN-INSTALASI-DAN-PENGGUNAAN.txt" target="_blank" rel="noopener" className="hover:text-slate-900">
              Panduan instalasi
            </a>
            <a href={DESKTOP_RELEASES_URL} target="_blank" rel="noopener" className="hover:text-slate-900">
              Semua rilis desktop
            </a>
            <a href={MOBILE_RELEASES_URL} target="_blank" rel="noopener" className="hover:text-slate-900">
              Semua rilis mobile
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
