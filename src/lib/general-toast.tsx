import { toast } from "sonner";
import SpinnerEye from "@/components/ui/spinner-eye";

export const generalToast = {
  success(title: string, description?: string) {
    toast.success(title, {
      description,
      icon: <SpinnerEye size={22} />,
    });
  },

  error(title: string, description?: string) {
    toast.error(title, {
      description,
      icon: <SpinnerEye size={22} />,
    });
  },

  warning(title: string, description?: string) {
    toast.warning(title, {
      description,
      icon: <SpinnerEye size={22} />,
    });
  },

  info(title: string, description?: string) {
    toast(title, {
      description,
      icon: <SpinnerEye size={22} />,
    });
  },

  loading(title: string, description?: string) {
    return toast.loading(title, {
      description,
      icon: <SpinnerEye size={22} />,
    });
  },

  dismiss(id?: string | number) {
    toast.dismiss(id);
  },
};