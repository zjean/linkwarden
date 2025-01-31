import SettingsLayout from "@/layouts/SettingsLayout";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import useAccountStore from "@/store/account";
import { AccountSettings } from "@/types/global";
import { toast } from "react-hot-toast";
import TextInput from "@/components/TextInput";
import { resizeImage } from "@/lib/client/resizeImage";
import ProfilePhoto from "@/components/ProfilePhoto";
import SubmitButton from "@/components/SubmitButton";
import React from "react";
import Checkbox from "@/components/Checkbox";

export default function Appearance() {
  const { theme, setTheme } = useTheme();

  const submit = async () => {
    setSubmitLoader(true);

    const load = toast.loading("Applying...");

    const response = await updateAccount({
      ...user,
    });

    toast.dismiss(load);

    if (response.ok) {
      toast.success("Settings Applied!");
    } else toast.error(response.data as string);
    setSubmitLoader(false);
  };

  const [submitLoader, setSubmitLoader] = useState(false);

  const { account, updateAccount } = useAccountStore();

  const [user, setUser] = useState<AccountSettings>(
    !objectIsEmpty(account)
      ? account
      : ({
          // @ts-ignore
          id: null,
          name: "",
          username: "",
          email: "",
          emailVerified: null,
          blurredFavicons: null,
          image: "",
          isPrivate: true,
          // @ts-ignore
          createdAt: null,
          whitelistedUsers: [],
        } as unknown as AccountSettings)
  );

  function objectIsEmpty(obj: object) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    if (!objectIsEmpty(account)) setUser({ ...account });
  }, [account]);

  return (
    <SettingsLayout>
      <div className="flex flex-col gap-3">
        <div>
          <p className="mb-3">Select Theme</p>
          <div className="flex gap-3 w-full">
            <div
              className={`w-full text-center outline-solid outline-sky-100 outline dark:outline-neutral-700 h-40 duration-100 rounded-md flex items-center justify-center cursor-pointer select-none bg-black ${
                theme === "dark"
                  ? "dark:outline-sky-500 text-sky-500"
                  : "text-white"
              }`}
              onClick={() => setTheme("dark")}
            >
              <FontAwesomeIcon icon={faMoon} className="w-1/2 h-1/2" />
              <p className="text-2xl">Dark Theme</p>

              {/* <hr className="my-3 outline-1 outline-sky-100 dark:outline-neutral-700" /> */}
            </div>
            <div
              className={`w-full text-center outline-solid outline-sky-100 outline dark:outline-neutral-700 h-40 duration-100 rounded-md flex items-center justify-center cursor-pointer select-none bg-white ${
                theme === "light"
                  ? "outline-sky-500 text-sky-500"
                  : "text-black"
              }`}
              onClick={() => setTheme("light")}
            >
              <FontAwesomeIcon icon={faSun} className="w-1/2 h-1/2" />
              <p className="text-2xl">Light Theme</p>
              {/* <hr className="my-3 outline-1 outline-sky-100 dark:outline-neutral-700" /> */}
            </div>
          </div>
        </div>

        <div>
          <Checkbox
            label="Blurred Link Icons"
            state={user.blurredFavicons}
            onClick={() =>
              setUser({ ...user, blurredFavicons: !user.blurredFavicons })
            }
          />
        </div>

        <SubmitButton
          onClick={submit}
          loading={submitLoader}
          label="Save"
          className="mt-2 mx-auto lg:mx-0"
        />
      </div>
    </SettingsLayout>
  );
}
