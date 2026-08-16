import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Send, Sparkles } from "lucide-react";
import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute("/_authenticated/assistant")({
  component: AssistantPage,
});

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

function AssistantPage() {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;

    const question = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("غير مسجل الدخول");

      const { data, error } = await supabase.functions.invoke(
        "ai-chat",
        {
          body: {
            studentId: user.id,
            message: question,
          },
        }
      );

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (err: any) {
      generalToast.error(err?.message || "حدث خطأ");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "حدث خطأ أثناء الاتصال بالمساعد.",
        },
      ]);
    } finally {
      setLoading(false);

      requestAnimationFrame(() => {
        taRef.current?.focus();
      });
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-4xl flex-col overflow-hidden px-3 py-4 md:px-6">

      {/* Header */}
      <div className="mb-4 shrink-0">
        <h1 className="flex items-center gap-2 text-xl font-black md:text-2xl">
          <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
          المساعد الذكي
        </h1>

        <p className="mt-1 text-xs text-muted-foreground md:text-sm">
          يجيب بأسلوب المستر خالد هاشم.
        </p>
      </div>

      {/* Chat */}
      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl">

        {/* Messages */}
        <div className="min-h-0 flex-1 overflow-y-auto p-3 md:p-5">
          <div className="space-y-4">

            {messages.length === 0 && (
              <div className="flex min-h-full items-center justify-center py-16 text-center">
                <div>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>

                  <p className="mb-4 text-sm text-muted-foreground">
                    ابدأ بسؤالك
                  </p>

                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "لماذا بدأت الحملة الفرنسية؟",
                      "اشرح ثورة 1952",
                      "ما أسباب العدوان الثلاثي؟",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setInput(q);
                          taRef.current?.focus();
                        }}
                        className="rounded-full border px-3 py-2 text-xs transition hover:bg-accent"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <ReactMarkdown>
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-end">
                <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                  <span className="animate-pulse">
                    يكتب...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 border-t bg-background p-3 md:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              ref={taRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اسأل أي سؤال..."
              className="min-h-[44px] resize-none rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />

            <Button
              onClick={send}
              disabled={loading || !input.trim()}
              className="h-11 w-11 shrink-0 rounded-xl p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </Card>
    </div>
  );
}