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

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

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

      const { data, error } =
        await supabase.functions.invoke(
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
      generalToast.error(err.message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "حدث خطأ أثناء الاتصال بالمساعد.",
        },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => taRef.current?.focus());
    }
  }

  return (
    <div className="mx-auto max-w-3xl flex flex-col h-[calc(100vh-7rem)]">

      <div className="mb-3">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          المساعد الذكي
        </h1>

        <p className="text-sm text-muted-foreground">
          يجيب بأسلوب المستر خالد هاشم.
        </p>
      </div>

      <Card className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-10">

            <p className="mb-4">
              ابدأ بسؤالك
            </p>

            <div className="flex flex-wrap gap-2 justify-center">

              {[
                "لماذا بدأت الحملة الفرنسية؟",
                "اشرح ثورة 1952",
                "ما أسباب العدوان الثلاثي؟",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="border rounded-full px-3 py-2 text-xs hover:bg-accent"
                >
                  {q}
                </button>
              ))}

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
              className={`max-w-[85%] rounded-xl px-4 py-3 ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <ReactMarkdown>
                {m.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-center animate-pulse">
            يكتب...
          </div>
        )}

      </Card>

      <div className="flex gap-2 mt-3">

        <Textarea
          ref={taRef}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اسأل أي سؤال..."
          className="resize-none"
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
        >
          <Send className="h-4 w-4" />
        </Button>

      </div>

    </div>
  );
}