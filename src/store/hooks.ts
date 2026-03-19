import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Hooks dùng để gọi Redux với đầy đủ kiểu dữ liệu (TypeScript)
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
