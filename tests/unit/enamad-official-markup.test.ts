import assert from "node:assert/strict";
import test from "node:test";
import { extractOfficialEnamadBadge } from "@/lib/security/enamad";

const officialMarkup =
  "<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=7206502&Code=sM6Q6kNQY4DdpoVICR18BC3a1E9N9jUq'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=7206502&Code=sM6Q6kNQY4DdpoVICR18BC3a1E9N9jUq' alt='' style='cursor:pointer' code='sM6Q6kNQY4DdpoVICR18BC3a1E9N9jUq'></a>";

test("official eNAMAD markup is returned byte-for-byte without reconstruction", () => {
  const badge = extractOfficialEnamadBadge(officialMarkup);

  assert.ok(badge);
  assert.equal(badge.html, officialMarkup);
  assert.equal(
    badge.verification,
    "https://trustseal.enamad.ir/?id=7206502&Code=sM6Q6kNQY4DdpoVICR18BC3a1E9N9jUq",
  );
  assert.equal(
    badge.image,
    "https://trustseal.enamad.ir/logo.aspx?id=7206502&Code=sM6Q6kNQY4DdpoVICR18BC3a1E9N9jUq",
  );
});

test("eNAMAD markup rejects added executable attributes and mismatched codes", () => {
  const executable = officialMarkup.replace(
    "target='_blank'",
    "target='_blank' onclick='alert(1)'",
  );
  const mismatched = officialMarkup.replace(
    "logo.aspx?id=7206502&Code=sM6Q6kNQY4DdpoVICR18BC3a1E9N9jUq",
    "logo.aspx?id=7206502&Code=DifferentCode",
  );

  assert.equal(extractOfficialEnamadBadge(executable), null);
  assert.equal(extractOfficialEnamadBadge(mismatched), null);
});
