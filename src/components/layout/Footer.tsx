import { useEffect, useState } from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Send,
  MessageCircle,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";

import { supabase } from "@/integrations/supabase/client";


export default function Footer() {

  const [settings, setSettings] = useState<any>(null);


  useEffect(() => {

  async function loadSettings() {

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();


    console.log("FOOTER SETTINGS:", data);
    console.log("FOOTER ERROR:", error);


    setSettings(data);

  }


  loadSettings();

}, []);



  const name =
    settings?.academy_name ||
    "منصة الجنرال خالد هاشم";



  return (

    <footer
      className="
      relative
      overflow-hidden
      bg-[#050505]
      text-white
      mt-20
      "
      dir="rtl"
    >



      {/* General Background */}

      {settings?.hero_image && (

        <div
          className="
          absolute
          inset-0
          z-0
          pointer-events-none
          "
        >

          <img
            src={settings.hero_image}
            alt=""
            className="
            w-full
            h-full
            object-cover
            opacity-10
            "
          />


          <div
            className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#050505]
            via-[#050505]/90
            to-[#050505]/40
            "
          />

        </div>

      )}





      <div
        className="
        relative
        z-10
        container
        mx-auto
        px-8
        py-16
        grid
        gap-12
        md:grid-cols-4
        "
      >



        {/* Academy */}

        <div>

{/* Logo Watermark Background */}

{settings?.logo_url && (

  <div
    className="
    absolute
    inset-0
    z-0
    flex
    flex-col
    items-center
    justify-center
    pointer-events-none
    "
  >

    <img
      src={settings.logo_url}
      alt=""
      className="
      w-[260px]
      opacity-[0.05]
      object-contain
      "
    />

    <h2
      className="
      mt-4
      text-7xl
      font-black
      tracking-widest
      text-white/[0.04]
      "
    >
      الجنرال
    </h2>

  </div>

)}



          <h2
            className="
            text-2xl
            font-black
            "
          >
            {name}
          </h2>



          <p
            className="
            mt-4
            text-gray-400
            leading-7
            "
          >
            اهلا بيك عزيزنا الطالب وجودك هنا معناه انك ضمنت مستقبلك مع الجنرال 😍
          </p>




          {/* Social Icons */}

          <div
            className="
            flex
            gap-4
            mt-6
            relative
            z-50
            "
          >


            {settings?.facebook_url && (

              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                hover:text-blue-500
                transition
                "
              >
                <Facebook size={22}/>
              </a>

            )}



            {settings?.instagram_url && (

              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                hover:text-pink-500
                transition
                "
              >
                <Instagram size={22}/>
              </a>

            )}



            {settings?.youtube_url && (

              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                hover:text-red-500
                transition
                "
              >
                <Youtube size={22}/>
              </a>

            )}



            {settings?.telegram_url && (

              <a
                href={settings.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                hover:text-sky-500
                transition
                "
              >
                <Send size={22}/>
              </a>

            )}



            {settings?.tiktok_url && (

              <a
                href={settings.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                hover:text-sky-500
                transition
                "
              >
                <FaTiktok size={22}/>
              </a>

            )}



            {settings?.whatsapp_number && (

              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                hover:text-green-500
                transition
                "
              >
                <MessageCircle size={22}/>
              </a>

            )}


          </div>


        </div>







        


        {/* Company */}

        <div>

          <h3 className="font-bold mb-6">
            اختصراتنا 
          </h3>


          <div className="space-y-4 text-gray-400">

            <p>من نحن</p>
            <p>تواصل معنا</p>
            

          </div>

        </div>







        {/* Support */}

        <div>

          <h3 className="font-bold mb-6">
            الدعم
          </h3>


          <div className="space-y-4 text-gray-400">


            {settings?.support_email && (

              <p>
                {settings.support_email}
              </p>

            )}



            {settings?.whatsapp_number && (

              <p>
                {settings.whatsapp_number}
              </p>

            )}



            {settings?.location && (

              <p>
                {settings.location}
              </p>

            )}


          </div>

        </div>



      </div>







      {/* Bottom */}

      <div
        className="
        relative
        z-10
        border-t
        border-white/10
        "
      >


        <div
          className="
          container
          mx-auto
          px-8
          py-6
          flex
          flex-col
          md:flex-row
          justify-between
          gap-4
          text-sm
          text-gray-500
          "
        >


          <p>
            © {new Date().getFullYear()} {name}
            {" "}— جميع الحقوق محفوظة الجنرال خالد هاشم
          </p>



          <p>

            Developed by{" "}

            <a
              href="https://m-w-groups.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="
              text-green-500
              font-bold
              hover:underline
              "
            >
              Ahmed Essam
            </a>

          </p>


        </div>


      </div>



    </footer>

  );

}