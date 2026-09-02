"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { LinearProgress, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface AuditLogEntry {
  id: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  action: string;
  changes: Record<string, { from: unknown; to: unknown }> | null;
  performedByName: string | null;
  performedByRole: string | null;
  created_at: string;
}

const PAGE_SIZE = 20;

const actionColor: Record<string, string> = {
  CREATE: "text-green-700 bg-green-100",
  UPDATE: "text-amber-700 bg-amber-100",
  DELETE: "text-red-700 bg-red-100",
};

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
};

const ContentHistory = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/auditLog/fetch", {
        page,
        pageSize: PAGE_SIZE,
      });
      if (res.data.success) {
        setLogs(res.data.value.logs);
        setTotal(res.data.value.total);
      }
    } catch (err) {
      console.warn(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl">
      <div className="flex flex-row items-center justify-between">
        <span className="font-bold">Content History</span>
        <span className="text-sm text-[#7C7C7C]">{total} total entries</span>
      </div>
      <div className="w-full border-b-2">{loading && <LinearProgress />}</div>
      <div className="flex flex-col gap-2">
        {!loading && logs.length === 0 && (
          <span className="text-sm text-[#7C7C7C] py-6 text-center">
            No changes recorded yet.
          </span>
        )}
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex flex-col gap-2 bg-white rounded-xl p-4"
          >
            <div className="flex flex-row items-center justify-between flex-wrap gap-2">
              <div className="flex flex-row items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-md capitalize ${
                    actionColor[log.action] ?? "text-gray-700 bg-gray-100"
                  }`}
                >
                  {log.action}
                </span>
                <span className="text-xs bg-[#f1f1f1] px-2 py-1 rounded-md">
                  {log.entityType}
                </span>
                <span className="font-semibold">{log.entityLabel}</span>
              </div>
              <span className="text-xs text-[#7C7C7C]">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
            <span className="text-sm text-[#555555]">
              By {log.performedByName ?? "Unknown"}
              {log.performedByRole ? ` (${log.performedByRole})` : ""}
            </span>
            {log.changes && Object.keys(log.changes).length > 0 && (
              <div className="flex flex-col gap-1 mt-1 border-t pt-2">
                {Object.entries(log.changes).map(([field, change]) => (
                  <div key={field} className="text-xs flex flex-row gap-2">
                    <span className="font-semibold min-w-[160px] capitalize">
                      {field}
                    </span>
                    <span className="text-red-500 line-through">
                      {formatValue(change.from)}
                    </span>
                    <span>→</span>
                    <span className="text-green-700">
                      {formatValue(change.to)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex flex-row items-center justify-center gap-4 pt-2">
          <IconButton
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft />
          </IconButton>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <IconButton
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default ContentHistory;
