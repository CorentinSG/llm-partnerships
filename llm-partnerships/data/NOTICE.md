# Third-party data notice

## `germany.json`

`germany.json` contains a low-resolution boundary for the Federal Republic of
Germany. Its geometry was copied from the `DEU` country file in
`johan/world.geo.json` and reformatted for this application. The coordinate
array is unchanged; the upstream `id: "DEU"` field was not retained.

- Source URL used and rechecked:
  <https://raw.githubusercontent.com/johan/world.geo.json/master/countries/DEU.geo.json>
- Retrieval/recheck date: 2026-07-26
- Revision pinned for reproducibility:
  [`c1677cd24e2384044a6d98df96306bdb3f513dfb`](https://github.com/johan/world.geo.json/blob/c1677cd24e2384044a6d98df96306bdb3f513dfb/countries/DEU.geo.json)
- Last path-specific change in the upstream repository: 2012-10-11,
  “Moved id properties towards beginning of lines.” A normalized comparison
  confirms that this revision and the current `master` file have the same
  Germany geometry as the local file.

### Documented upstream chain

The `DEU` file was added to `johan/world.geo.json` in commit
[`261b1500c01980a35d98b5e6533be03673dc708c`](https://github.com/johan/world.geo.json/commit/261b1500c01980a35d98b5e6533be03673dc708c).
That commit identifies this archived Mike Bostock “Spinny Globe” gist payload
as its source:

<https://gist.github.com/raw/1246403/c5094cef84e05315e37a3fa6afec54c5b5e6745c/readme.json>

### Licensing determination

The `johan/world.geo.json` repository includes an
[`UNLICENSE`](https://github.com/johan/world.geo.json/blob/master/UNLICENSE)
that dedicates the repository contents to the public domain. However, the
repository’s own
[`README`](https://github.com/johan/world.geo.json/blob/master/README.md)
describes the underlying dataset’s legal status as “dubious,” and the archived
gist revision cited by the import commit does not provide a license or a
further authoritative source.

Accordingly, the repository-level Unlicense is documented, but the upstream
geometry’s rights chain is not sufficiently clear to claim definitive public
domain clearance. For a use that requires a fully documented provenance and
license chain, replace this boundary with a directly sourced dataset whose
publisher and terms are explicit.
