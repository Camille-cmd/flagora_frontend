import * as Yup from "yup";
import i18n from "../i18n/i18n.tsx";

export const passwordValidation = Yup.string()
    .min(8, i18n.t("passwordRules.length"))
    .matches(/[A-Z]/, i18n.t("passwordRules.uppercase"))
    .matches(/\d/, i18n.t("passwordRules.number"))
    .required(i18n.t("register.password.validation.required"));

export const passwordConfirmValidation = Yup.string()
    .oneOf([Yup.ref("password")], i18n.t("register.confirmPassword.validation.match"))
    .required(i18n.t("register.confirmPassword.validation.required"));

export const emailValidation = Yup.string()
    .email(i18n.t("register.email.validation.required"))
    .required(i18n.t("register.email.validation.invalid"))

export const UsernameValidation = Yup.string()
    .matches(/^[\w.-]+$/, i18n.t("register.username.validation.pattern"))
    .min(2, i18n.t("register.username.validation.minLength")) // Minimum 2 characters (not checked by backend)
    .max(150, i18n.t("register.username.validation.maxLength"))
    .required(i18n.t("register.username.validation.required"))
