
import { getProfile } from "@/actions/profile/profile-actions";
import { ProfileClient } from "@/components/profile/profile-client";

export default async function ProfilePage() {
  const result = await getProfile();

  return (
    <ProfileClient
      initialProfile={
        result.success
          ? result.data ?? null
          : null
      }
      initialError={
        result.success
          ? undefined
          : result.error
      }
    />
  );
}

