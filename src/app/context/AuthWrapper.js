// "use client";

// import { ReactNode, useEffect, useState } from "react";
// import { useAuth } from "./AuthContext";
// import { useRouter } from "next/navigation"; // use next/navigation for Next 13+

// interface AuthWrapperProps {
//   children: ReactNode;
// }

// export default function AuthWrapper({ children }: AuthWrapperProps) {
//   const { user, token } = useAuth(); // get user/token from context
//   const router = useRouter();
//   const [loadingAuth, setLoadingAuth] = useState(true);

//   useEffect(() => {
//     // Wait a tick for context to be available
//     if (user === undefined) return; // still initializing
//     if (!user) {
//       router.push("/login"); // redirect if not logged in
//     } else {
//       setLoadingAuth(false); // user exists, stop loading
//     }
//   }, [user, router]);

//   if (loadingAuth) return <p className="text-center mt-5">Chargement...</p>;
//   if (!user) return null; // prevents rendering before redirect

//   return <>{children}</>;
// }
