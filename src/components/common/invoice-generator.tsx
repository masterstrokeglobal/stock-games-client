"use client";

import { createRoot } from "react-dom/client";
import React from "react";
import { toast } from "sonner";
import UserTransaction from "../admin/Reports/UserTransaction";
import TransactionsReport from "../admin/Reports/TransactionsReport";

export async function handleSingleDownload({
  type,
  data,
}: {
  type: string;
  data: any;
}) {
  try {
    if (typeof window === "undefined") {
      // Prevent running in SSR/prerender
      return;
    }

    const { default: html2pdf } = await import("html2pdf.js");

    const container = document.createElement("div");
    // Keep element renderable for html2canvas: do NOT use display:none or visibility:hidden
    // Position it far off-screen so it doesn't affect layout/visibility
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.style.zIndex = "-1";
    document.body.appendChild(container);

    // Render the appropriate component based on the invoice type
    let element;

    if (type === "userTransactionReport") {
      element = <UserTransaction data={data} />;
    } else if (type === "transactionsReport") {
      element = <TransactionsReport data={data} />;
    } else {
      toast.error("Download failed. Please try again");
      return;
    }

    // Render the invoice component using React 18 root API
    const root = createRoot(container);
    root.render(element);

    // Wait a tick to allow React to commit the render
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    const invoiceElement = container.firstChild as HTMLElement | null;
    const filename = `${type}_invoice.pdf`;

    if(!invoiceElement) {
      toast.error("Invoice element not found");
      try { root.unmount(); } catch {}
      try { document.body.removeChild(container); } catch {}
      return;
    }

    const options = {
      margin: 1,
      filename,
      html2canvas: { scale: 2 },
      jsPDF: { format: "a4" },
    };

    // Generate and download PDF
    html2pdf()
      .from(invoiceElement)
      .set(options)
      .save()
      .then(() => {
        toast.success(`Downloaded ${filename}`);
        root.unmount();
        document.body.removeChild(container); // Clean up
      })
      .catch((error) => {
        console.error("PDF Generation Error:", error);
        toast.error("Error generating PDF. Please try again.");
        try { root.unmount(); } catch {}
        try { document.body.removeChild(container); } catch {}
      });
  } catch (error) {
    toast.error("Something went wrong");
    console.error("PDF Generation Error:", error);
  }
}
