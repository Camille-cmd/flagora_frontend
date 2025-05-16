// Validate username availability
import debounce from "lodash/debounce";
import AuthService from "../services/auth/AuthService.tsx";
import i18n from "../i18n/i18n.tsx";

const validateUsernameAvailability = async (value: string): Promise<string | undefined> => {
    if (!value || value.length < 2) return undefined; // Skip validation if empty or too short

    const available = await AuthService.isUserNameAvailable(value);
    return available ? undefined : i18n.t("register.username_not_available");
};
// Debounce it (500ms delay after user stops typing)
const debouncedValidateUsername = debounce(
    (value: string, callback: (msg?: string) => void) => {
        validateUsernameAvailability(value).then(callback);
    },
    500
);
// Wrapper function to use with Formik
export const validateUsername = (value: string): Promise<string | undefined> => {
    return new Promise((resolve) => {
        debouncedValidateUsername(value, resolve);
    });
};
