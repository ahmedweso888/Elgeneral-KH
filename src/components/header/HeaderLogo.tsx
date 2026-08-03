import logo from "@/assests/logo.png";

export default function HeaderLogo() {
  return (
    <div className="h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-black">
      <img
        src={logo}
        alt="الجنرال خالد هاشم"
        className="h-10 w-14 scale-150 object-contain"
      />
    </div>
  );
}