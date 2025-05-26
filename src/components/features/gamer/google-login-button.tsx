'use client'
import { useGoogleCreateLogin } from "@/react-query/game-user-queries";
import { GoogleLogin } from "@react-oauth/google";
import { COMPANYID } from "@/lib/utils";
import { useRouter } from "next/navigation";
const GoogleLoginButton = () => {
    const { mutate: googleSignIn } = useGoogleCreateLogin();
    const router = useRouter();

    const handleGoogleLogin = (token: string) => {
        if (token) {
            googleSignIn({ googleToken: token, companyId: COMPANYID }, {
                
                onSuccess: () => {
                    router.push("/game/platform");
                }
            });
        }
    };

    return (
        <GoogleLogin
            containerProps={{
                className: "w-full !h-12"
            }}
            onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                    handleGoogleLogin(credentialResponse.credential);
                }
            }}
            onError={() => {
                console.log('Google Login Failed');
            }}
        />
    );
};

export default GoogleLoginButton;
