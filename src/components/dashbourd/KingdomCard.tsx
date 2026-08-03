import { Card } from "@/components/ui/card";
import { Castle, Crown, Coins, Gem, Shield } from "lucide-react";

type Props = {
  kingdom: any;
};

export default function KingdomCard({ kingdom }: Props) {
  if (!kingdom) return null;

  return (
    <Card className="p-6 rounded-2xl shadow-lg">

      <div className="flex items-center gap-3 mb-6">

        <Castle className="w-8 h-8 text-yellow-500" />

        <div>
          <h2 className="font-bold text-xl">
            مملكتك
          </h2>

          <p className="text-sm text-muted-foreground">
            طور مملكتك بالمذاكرة
          </p>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-primary/10 p-4">
          <Crown className="mb-2 text-primary" />
          <div className="text-sm">Castle</div>
          <div className="text-2xl font-bold">
            Lv {kingdom.castle_level}
          </div>
        </div>

        <div className="rounded-xl bg-primary/10 p-4">
          <Shield className="mb-2 text-primary" />
          <div className="text-sm">City</div>
          <div className="text-2xl font-bold">
            Lv {kingdom.city_level}
          </div>
        </div>

        <div className="rounded-xl bg-yellow-500/10 p-4">
          <Coins className="mb-2 text-yellow-500" />
          <div className="text-sm">Gold</div>
          <div className="text-2xl font-bold">
            {kingdom.gold}
          </div>
        </div>

        <div className="rounded-xl bg-cyan-500/10 p-4">
          <Gem className="mb-2 text-cyan-500" />
          <div className="text-sm">Diamonds</div>
          <div className="text-2xl font-bold">
            {kingdom.diamonds}
          </div>
        </div>

      </div>

      <div className="mt-6 rounded-xl bg-accent p-4">

        <div className="text-sm text-muted-foreground">
          قوة الجيش
        </div>

        <div className="text-3xl font-black">
          ⚔️ {kingdom.army_power}
        </div>

      </div>

    </Card>
  );
}