import { ReactNode, createContext, useContext, useReducer } from "react";
import { Address, zeroAddress } from "viem";

type UserInfoType = {
  address: Address;
  rating: number;
};

export const UserInfoContext = createContext<UserInfoType | undefined>(
  undefined
);

const UserInfoDispatchContext = createContext<any>(null);

const initialValue: UserInfoType = {
  address: zeroAddress,
  rating: 1000,
};

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const [user, dispatch] = useReducer(userInfoReducer, initialValue);

  return (
    <UserInfoContext.Provider value={user}>
      <UserInfoDispatchContext.Provider value={dispatch}>
        {children}
      </UserInfoDispatchContext.Provider>
    </UserInfoContext.Provider>
  );
}

export function useUserInfo() {
  return useContext(UserInfoContext);
}

export function useUserInfoDispatch() {
  return useContext(UserInfoDispatchContext);
}

function userInfoReducer(userInfo: UserInfoType, action: any) {
  switch (action.type) {
    case "UPDATE_ADDRESS":
      return {
        address: action.payload.address,
        rating: userInfo.rating,
      };
    case "UPDATE_RATING":
      return {
        address: userInfo.address,
        rating: action.payload.rating,
      };
    default:
      throw Error("Unknown action: " + action.type);
  }
}
