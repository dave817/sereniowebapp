{ pkgs }: {
  deps = [
    pkgs.lsof
    pkgs.nodejs-18_x
    pkgs.postgresql
    pkgs.nodePackages.typescript
  ];
}
