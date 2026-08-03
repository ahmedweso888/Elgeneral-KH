import { Search } from "lucide-react";

export default function HeaderSearch() {
  return (
    <div className="flex flex-1 min-w-0">
      <div className="relative w-full">

        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
        />

        <input
          placeholder="ابحث عن درس أو امتحان..."
          className="
            h-10
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            pr-10
            px-4
            text-sm
            outline-none
            transition-all
            focus:border-blue-600
            focus:bg-white
          "
        />

      </div>
    </div>
  );
}