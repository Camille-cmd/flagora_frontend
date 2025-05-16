import axios from "axios";
import {BackendErrorResponse} from "../../interfaces/apiResponse.tsx";

export function extractErrorMessage(error: unknown, fallback: string = "An unknown error occurred"): string {
    if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as BackendErrorResponse;
        return data.errorMessage ?? fallback;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return fallback;
}
