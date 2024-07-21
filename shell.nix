let
  unstable = import (fetchTarball "https://releases.nixos.org/nixos/unstable/nixos-24.11pre652902.693bc46d169f/nixexprs.tar.xz") { };
in
{ nixpkgs ? import <nixpkgs> {} }:

nixpkgs.mkShell {
  nativeBuildInputs = with nixpkgs; [
    unstable.python311
    unstable.python311Packages.pip
  ];

  shellHook = ''
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
  '';

  LD_LIBRARY_PATH = "${nixpkgs.stdenv.cc.cc.lib}/lib";
}
