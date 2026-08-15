import assert from "node:assert/strict";
import test from "node:test";
import { extractOfficialEnamadBadge } from "@/lib/security/enamad";

const badgeId = "1234567";
const badgeCode = "OfficialMarkupTestCode123";
const officialMarkup =
  `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=${badgeId}&Code=${badgeCode}'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=${badgeId}&Code=${badgeCode}' alt='' style='cursor:pointer' code='${badgeCode}'></a>`;

test("official eNAMAD markup is parsed into verified URLs without raw HTML execution", () => {
  const badge = extractOfficialEnamadBadge(officialMarkup);

  assert.ok(badge);
  assert.equal("html" in badge, false);
  assert.equal(
    badge.verification,
    `https://trustseal.enamad.ir/?id=${badgeId}&Code=${badgeCode}`,
  );
  assert.equal(
    badge.image,
    `https://trustseal.enamad.ir/logo.aspx?id=${badgeId}&Code=${badgeCode}`,
  );
});

test("eNAMAD markup rejects added executable attributes and mismatched codes", () => {
  const executable = officialMarkup.replace(
    "target='_blank'",
    "target='_blank' onclick='alert(1)'",
  );
  const mismatched = officialMarkup.replace(
    `logo.aspx?id=${badgeId}&Code=${badgeCode}`,
    `logo.aspx?id=${badgeId}&Code=DifferentCode`,
  );

  assert.equal(extractOfficialEnamadBadge(executable), null);
  assert.equal(extractOfficialEnamadBadge(mismatched), null);
});
