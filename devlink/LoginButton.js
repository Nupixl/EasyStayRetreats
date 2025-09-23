"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./LoginButton.module.css";

export function LoginButton({
  as: _Component = _Builtin.Link,
  visibilityIcon = true,
  textButtonText = "Log in with Google",
  metaOnClick = {},

  metaLink = {
    href: "#",
  },

  metaId,
  imageIcon = "https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/68d1e2092e32cb15ff9c1e2b_Icon-%2F-Google.svg",
}) {
  return (
    <_Component
      className={_utils.cx(_styles, "login-button")}
      button={false}
      id={metaId}
      block=""
      options={metaLink}
      {...metaOnClick}
    >
      {visibilityIcon ? (
        <_Builtin.Image
          className={_utils.cx(_styles, "icon-google")}
          loading="lazy"
          width="24"
          height="24"
          src={imageIcon}
        />
      ) : null}
      <_Builtin.Block tag="div">{textButtonText}</_Builtin.Block>
    </_Component>
  );
}
