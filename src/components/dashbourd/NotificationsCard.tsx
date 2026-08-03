import { Card } from "@/components/ui/card";

type Props = {
  notifications: any[];
};

export default function NotificationsCard({ notifications }: Props) {
  return (
    <Card className="p-6">

      <h2 className="text-xl font-bold mb-5">
        🔔 الإشعارات
      </h2>

      {notifications.length === 0 && (
        <p className="text-muted-foreground">
          لا توجد إشعارات
        </p>
      )}

      <div className="space-y-4">

        {notifications.map((item) => (

          <div
            key={item.id}
            className="border rounded-xl p-4"
          >

            <h3 className="font-bold">
              {item.title}
            </h3>

            <p className="text-sm text-muted-foreground mt-2">
              {item.message}
            </p>

          </div>

        ))}

      </div>

    </Card>
  );
}