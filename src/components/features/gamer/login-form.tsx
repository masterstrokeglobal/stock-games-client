"use client";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormPassword from "@/components/ui/form/form-password";
import FormProvider from "@/components/ui/form/form-provider";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DemoUserLogin from "./demo-user-login";
import GoogleLoginButton from "./google-login-button";
import { useCaptcha } from "@/react-query/game-user-queries";
import { useEffect } from "react";
import { RefreshCcwIcon } from "lucide-react";
import AuthTabs from "./auth-tabs";

export const createLoginSchema = (t: any) =>
  z.object({
    username: z.string(),
    password: z
      .string()
      .min(6, t("validation.password-min"))
      .max(20, t("validation.password-max"))
      .nonempty(t("validation.password-required")),
    answer: z.string().nonempty(t("validation.captcha-required")),
    captchaId: z.string().nonempty(t("validation.captcha-is-required")),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

type Props = {
  defaultValues?: LoginFormValues;
  onSubmit: (data: LoginFormValues) => void;
  onForgotPassword: () => void;
  isLoading?: boolean;
};

const LoginForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
  const t = useTranslations("auth");
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues,
  });
  const { control, handleSubmit } = form;
  const { data, error, isLoading: isCaptchaLoading, refetch } = useCaptcha();
  const captchaSvg = data?.data.svg || "";
  const captchaId = data?.data.id;

  useEffect(() => {
    if (captchaId) {
      form.setValue("captchaId", captchaId, { shouldValidate: true });
    }
  }, [captchaId, form]);

  const captchaError = error ? t("errors.captcha-fetch-failed") : "";
  const handleRefreshCaptcha = () => refetch();

  return (
    <div className="w-full max-w-sm">
      <AuthTabs />
      <FormProvider
        methods={form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-3">
          <FormInput
            control={control}
            game
            name="username"
            label={t("labels.username-email")}
            required
          />

          <div className="space-y-1">
            <FormPassword
              control={control}
              game
              name="password"
              type="password"
              label={t("labels.password")}
              required
            />
            <Link
              href="/game/auth/forgot-password"
              className="text-white text-xs text-end block"
            >
              {t("links.forgot-password")}
            </Link>
          </div>

          {/* CAPTCHA - Improved Version */}
          {isCaptchaLoading ? (
            <p className="text-white text-sm">{t("common.loading")}</p>
          ) : captchaSvg ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-white text-sm font-medium">{t("labels.captcha")}</p>
               
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div
                  className="border border-secondary-game rounded bg-gray-900 [&>svg]:w-full [&>svg]:h-full h-10  mx-auto sm:mx-0"
                  dangerouslySetInnerHTML={{ __html: captchaSvg }}
                />
                <span className="text-white text-sm font-medium flex items-center justify-center">
                  =
                </span>
                <FormInput
                  control={control}
                  name="answer"
                  className="text-white flex-grow"
                  inputClassName="h-10"
                  required
                  placeholder={t("labels.captcha")}
                /> 
                
                 <Button
                  type="button"
                  title={t("refresh-captcha")}
                  variant="secondary"
                  size="icon"
                  className="text-sm  hover:bg-gray-700"
                  onClick={handleRefreshCaptcha}
                >
                  <RefreshCcwIcon className="w-4 h-4" />
                </Button>
              </div>
              {captchaError && (
                <p className="text-red-500 text-xs">{captchaError}</p>
              )}
            </div>
          ) : null}
        </div>

        <Button
          type="submit"
          variant="game"
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? t("buttons.signing-in") : t("buttons.sign-in")}
        </Button>
      </FormProvider>

      <div className="flex items-center my-2 justify-center gap-2 text-white text-sm">
        <Separator className="my-3 flex-1 bg-white/20" />
        <span>{t("common.or")}</span>
        <Separator className="my-3 flex-1 bg-white/20" />
      </div>

      <div className="flex gap-2">
        <GoogleLoginButton />
        <DemoUserLogin className="h-10" />
      </div>
    </div>
  );
};

export default LoginForm;
