import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default async function Icon() {
  const logo = await readFile(
    path.join(process.cwd(), "public", "brands", "bcu-logo.png"),
  );
  const logoData = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090909",
          border: "3px solid #c9a54c",
          borderRadius: "14px",
          padding: "5px",
          boxSizing: "border-box",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse requires an HTML img element for generated icons. */}
        <img
          src={logoData}
          alt="BCU Group"
          width="52"
          height="52"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
