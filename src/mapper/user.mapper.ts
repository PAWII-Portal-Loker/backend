import { UserDto } from "@user/dtos/user.dto";
import { UserResDto } from "@user/dtos/userRes.dto";

export function userMapper(user: UserDto): UserResDto {
  return {
    id: user._id as string,
    role: user?.role ?? "",
    email: user?.email ?? "",
    waNumber: user?.waNumber ?? "",
    imageUrl: user?.imageUrl ?? "",
    bio: user?.bio ?? "",
    province: user?.province ?? "",
    city: user?.city ?? "",
    subdistrict: user?.subdistrict ?? "",
    address: user?.address ?? "",
    createdAt: user?.createdAt ?? "",
    updatedAt: user?.updatedAt ?? "",
  };
}
