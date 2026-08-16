import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
} from "lucide-react";

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

      if (!user) {
        throw new Error("غير مسجل الدخول");
      }

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

      if (!data?.reply) {
        throw new Error("لم تصل إجابة من المساعد");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (err: any) {
      console.error(err);

      generalToast.error(
        err?.message || "حدث خطأ أثناء الاتصال بالمساعد"
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "عذراً، حصلت مشكلة وأنا بحاول أجيبلك الإجابة. جرّب تاني.",
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
    <div
      dir="rtl"
      className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-5xl flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border/60 px-4 py-4 md:px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-base font-black md:text-lg">
            المساعد الذكي
          </h1>

          <p className="text-xs text-muted-foreground">
            اسأل المساعد عن التاريخ
          </p>
        </div>

        <div className="mr-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          متصل
        </div>
      </div>

      {/* Chat */}
      <Card className="flex-1 overflow-hidden rounded-none border-0 bg-background shadow-none">
        <div className="h-full overflow-y-auto px-3 py-5 md:px-6">
          {messages.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>

              <h2 className="text-xl font-black">
                أهلاً بيك 👋
              </h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                اسألني عن أي حاجة في التاريخ وأنا هساعدك تفهمها
                بطريقة بسيطة.
              </p>

              <div className="mt-6 flex max-w-xl flex-wrap justify-center gap-2">
                {[
                  "لماذا بدأت الحملة الفرنسية؟",
                  "اشرح ثورة 1952",
                  "ما أسباب العدوان الثلاثي؟",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      requestAnimationFrame(() =>
                        taRef.current?.focus()
                      );
                    }}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-xs transition hover:bg-accent"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
              {messages.map((m, i) => {
                const isUser = m.role === "user";

                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${
                      isUser
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    {!isUser && (
                      <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] px-4 py-3 text-sm leading-7 shadow-sm md:max-w-[75%] ${
                        isUser
                          ? "rounded-2xl rounded-bl-md bg-primary text-primary-foreground"
                          : "rounded-2xl rounded-br-md border border-border/60 bg-muted/60 text-foreground"
                      }`}
                    >
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="my-2 list-disc pr-5">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="my-2 list-decimal pr-5">
                              {children}
                            </ol>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-black">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    </div>

                    {isUser && (
                      <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-end justify-end gap-2">
                  <div className="flex items-center gap-2 rounded-2xl rounded-br-md border border-border/60 bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>بيفكر...</span>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </Card>

      {/* Input */}
      <div className="shrink-0 border-t border-border/60 bg-background px-3 py-3 md:px-6">
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-border bg-muted/30 p-2">
          <Textarea
            ref={taRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            className="min-h-11 resize-none border-0 bg-transparent px-3 py-2 text-sm shadow-none focus-visible:ring-0"
            disabled={loading}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();
                send();
              }
            }}
          />

          <Button
            onClick={send}
            disabled={loading || !input.trim()}
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Enter للإرسال • Shift + Enter لسطر جديد
        </p>
      </div>
    </div>
  );
}