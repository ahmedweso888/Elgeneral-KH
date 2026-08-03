import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `
  inline-flex
  items-center
  justify-center
  gap-2
  whitespace-nowrap
  rounded-xl
  text-sm
  font-semibold
  cursor-pointer
  transition-all
  duration-300
  active:scale-[0.96]
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-blue-500/40
  disabled:pointer-events-none
  disabled:opacity-50
  disabled:cursor-not-allowed

  [&_svg]:pointer-events-none
  [&_svg]:size-5
  [&_svg]:shrink-0
  `,
  {
    variants: {

      variant: {

        /* الزر الأساسي - جنرال */
        default:
          `
          bg-gradient-to-r
          from-blue-600
          via-indigo-600
          to-purple-600
          text-white
          shadow-lg
          shadow-blue-500/25
          hover:shadow-blue-500/40
          hover:-translate-y-0.5
          hover:brightness-110
          `,


        /* زر خطر */
        destructive:
          `
          bg-gradient-to-r
          from-red-500
          to-rose-600
          text-white
          shadow-lg
          shadow-red-500/20
          hover:brightness-110
          `,


        /* زر شفاف */
        outline:
          `
          border
          border-slate-200
          bg-white/80
          backdrop-blur
          text-slate-700
          shadow-sm
          hover:border-blue-400
          hover:text-blue-600
          hover:bg-blue-50
          `,


        /* زر ثانوي */
        secondary:
          `
          bg-slate-100
          text-slate-800
          hover:bg-slate-200
          hover:-translate-y-0.5
          `,


        /* للأيقونات */
        ghost:
          `
          hover:bg-blue-50
          hover:text-blue-600
          `,


        /* لينك */
        link:
          `
          text-blue-600
          underline-offset-4
          hover:underline
          `,
      },


      size: {

        default:
          `
          h-11
          px-6
          rounded-xl
          `,


        sm:
          `
          h-9
          px-4
          rounded-lg
          text-xs
          `,


        lg:
          `
          h-14
          px-8
          rounded-2xl
          text-base
          `,


        icon:
          `
          h-11
          w-11
          rounded-xl
          `,
      },
    },


    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref
  ) => {

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    );

  }
);


Button.displayName = "Button";


export {
  Button,
  buttonVariants,
};