import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      dir="rtl"
      richColors
      closeButton
      expand
      position="top-center"
      visibleToasts={4}
      toastOptions={{
        duration: 3500,
        style: {
      width: "400px",   // العرض اللي انت عايزه
      maxWidth: "none", // يكسر الحد الافتراضي
        },
        classNames: {
          toast: `
            group
            rounded-2xl
            border
            border-amber-400/25
            bg-zinc-950/90
            backdrop-blur-xl
            text-white
            shadow-[0_8px_35px_rgba(0,0,0,.45)]
            px-5
            py-4
          `,

          title: `
            font-bold
            text-[15px]
            text-white
          `,

          description: `
            text-zinc-300
            text-sm
          `,

          success: `
            border-emerald-500/35
          `,

          error: `
            border-red-500/35
          `,

          warning: `
            border-amber-500/35
          `,

          info: `
            border-sky-500/35
          `,

          actionButton: `
            bg-amber-500
            text-black
            rounded-lg
          `,

          cancelButton: `
            bg-zinc-800
            text-zinc-200
            rounded-lg
          `,

          closeButton: `
            bg-transparent
            border-0
            text-zinc-400
            hover:text-white
          `,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };