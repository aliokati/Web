/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: import("./content-manager/types").SessionUser;
  }
}
