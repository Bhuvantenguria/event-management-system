"use client";

import React, { useState, useEffect } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, RefreshCw } from "lucide-react";

export default function AdminEmailPage() {
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/email/test");
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch {}
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toEmail: testEmail }),
      });
      const data = await res.json();
      setSending(false);

      if (res.ok) {
        setResult({ type: "success", text: data.message });
        fetchLogs();
      } else {
        setResult({ type: "error", text: data.error || "Failed to send test email." });
      }
    } catch (err: any) {
      setSending(false);
      setResult({ type: "error", text: err.message || "Network error." });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
            Gmail SMTP & <span className="gold-gradient-text">Nodemailer Dispatcher</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Zero paid APIs. Direct Google App Password / SMTP infrastructure for festival notifications
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3 py-1.5 rounded-md border border-border text-xs flex items-center space-x-1 hover:bg-muted"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* SMTP Environment Checklist */}
      <div className="bg-card rounded-2xl border border-heritage-gold/30 p-6 space-y-4 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-foreground flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-heritage-gold" />
          Nodemailer Gmail Engine Diagnostics
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-heritage-sandstone/15 dark:bg-heritage-sandstone/10 border border-heritage-gold/20">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Host
            </span>
            <span className="font-mono font-bold text-foreground">smtp.gmail.com</span>
          </div>
          <div className="p-3 rounded-lg bg-heritage-sandstone/15 dark:bg-heritage-sandstone/10 border border-heritage-gold/20">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Port
            </span>
            <span className="font-mono font-bold text-foreground">465 (SSL/TLS)</span>
          </div>
          <div className="p-3 rounded-lg bg-heritage-sandstone/15 dark:bg-heritage-sandstone/10 border border-heritage-gold/20">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Runtime
            </span>
            <span className="font-mono font-bold text-foreground">Node.js Serverless</span>
          </div>
          <div className="p-3 rounded-lg bg-heritage-sandstone/15 dark:bg-heritage-sandstone/10 border border-heritage-gold/20">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Cost
            </span>
            <span className="font-mono font-bold text-emerald-600">₹0.00 (Zero Paid APIs)</span>
          </div>
        </div>

        {/* Test Email Form */}
        <form onSubmit={handleSendTest} className="pt-2 space-y-3">
          <label className="text-xs font-bold text-foreground block">
            Send Test Diagnostic Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              required
              placeholder="Enter recipient email (e.g. yourname@gmail.com)"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-md bg-background border border-border text-foreground"
            />
            <button
              type="submit"
              disabled={sending}
              className="px-5 py-2 rounded-md bg-heritage-maroon hover:bg-heritage-maroon-dark text-heritage-ivory text-xs font-bold border border-heritage-gold shadow-md flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-heritage-gold" />
              <span>{sending ? "Sending..." : "Dispatch Test"}</span>
            </button>
          </div>
        </form>

        {result && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center space-x-2 ${
              result.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 border border-destructive/30 text-destructive"
            }`}
          >
            {result.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{result.text}</span>
          </div>
        )}
      </div>

      {/* Dispatch History Log */}
      <div className="bg-card rounded-2xl border border-heritage-gold/30 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border font-serif font-bold text-sm text-foreground">
          Email Notification Dispatch History ({logs.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-2.5 px-4">Recipient</th>
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No emails dispatched in this session yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-heritage-sandstone/10">
                    <td className="py-2.5 px-4 font-bold text-foreground">{log.to}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{log.subject}</td>
                    <td className="py-2.5 px-4 font-mono uppercase text-[10px] text-heritage-gold">
                      {log.type}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === "sent"
                            ? "bg-emerald-500/20 text-emerald-600"
                            : log.status === "simulated"
                            ? "bg-blue-500/20 text-blue-600"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right text-muted-foreground font-mono text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
