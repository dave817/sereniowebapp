{
  description = "Serenio Web - Mental Health AI Assistant";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs-18_x
            postgresql
            nodePackages.typescript
            nodePackages.tsx
            nodePackages.npm
          ];

          shellHook = ''
            export PGDATA="$PWD/postgres_data"
            export DATABASE_URL="postgres://postgres:postgres@localhost:5432/serenio"
            
            if [ ! -d "$PGDATA" ]; then
              initdb -D "$PGDATA" --auth=trust --no-locale --encoding=UTF8
              echo "listen_addresses = '*'" >> "$PGDATA/postgresql.conf"
              echo "host all all 0.0.0.0/0 trust" >> "$PGDATA/pg_hba.conf"
            fi
            
            pg_ctl -D "$PGDATA" -l "$PGDATA/postgresql.log" start || true
            createdb serenio || true
          '';
        };
      }
    );
