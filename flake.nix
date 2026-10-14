{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      packages.${system}.default = pkgs.runCommand "site" { } ''
        mkdir -p $out
        cp -r ${./site}/* $out/
      '';

      devShells.${system}.default = pkgs.mkShell {
        packages = [ pkgs.python3 ];
        shellHook = ''
          (sleep 1 && xdg-open http://localhost:8000) &
          python3 -m http.server 8000 -d site &
        '';
      };
    };
}
