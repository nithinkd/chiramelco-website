# Chiramel & Co IP Firm Profile PDF - Handoff Note

**Document status:** Completed profile design and publication record  
**Prepared:** 24 May 2026 (Asia/Kolkata)  
**Public URL:** <https://chiramelco.com/profile-ip>  
**Displayed filename:** `Chiramel-Co-IP-Profile.pdf`  
**Project root:** `/Users/nithinkdavid/Documents/chiramelco-website`

## Purpose

This note records the completed intellectual property focused firm profile PDF, its visual and content decisions, the editable production source, and how it is exposed from the live website. It should be read before making further changes to the PDF or deploying root-level website files.

## Completed Deliverable

The firm profile was reduced from an earlier seven-page draft to a concise five-page profile intended for client sharing and introductory business development conversations.

Local publication-quality artifact:

```text
deliverables/company-profile/Chiramel-Co-IP-Profile.pdf
```

The same named file is present in the Astro static public source for future site builds:

```text
public/Chiramel-Co-IP-Profile.pdf
```

The local publication-quality PDF is approximately `5.1 MB`. A live verification on 24 May 2026 showed that the currently hosted copy at `/profile-ip` is approximately `2.24 MB`, indicating a smaller web-distribution version has been uploaded or produced separately. Do not overwrite that live optimisation unintentionally when deploying future site changes.

## Public Presentation

The profile is made available at the short public URL:

```text
https://chiramelco.com/profile-ip
```

Final chosen behavior is to display the PDF inside the browser, allowing the browser's own download control to be used. The local Apache source is configured accordingly in:

```text
public/.htaccess
```

Relevant rule:

```apache
# Display the IP firm profile from a short public URL.
RewriteRule ^profile-ip/?$ Chiramel-Co-IP-Profile.pdf [L]
```

Do not add a `Content-Disposition: attachment` rule unless the firm later decides that the short URL should force an immediate file download. Live verification on 24 May 2026 returned `Content-Type: application/pdf` and no attachment header.

## Page Structure

The final document has five pages:

| Page | Section | Purpose |
| --- | --- | --- |
| 1 | Cover | Premium IP-facing identity and immediate web access |
| 2 | About the Firm | Full-service foundation, 1985 establishment and forum experience |
| 3 | Counsel | Jos Chiramel and Christine Chiramel profiles, followed by associate advocates |
| 4 | IP Capabilities | Rights lifecycle service offering |
| 5 | Practices and Contact | Other practices, associate office presence and direct contact actions |

The counsel page was intentionally moved before services. This establishes the people behind the practice before presenting the capability list.

## Cover Design Decisions

The approved cover avoids illustrative legal still-life imagery in favour of a restrained material-led composition:

- graphite-coloured leather texture in the upper block;
- warm ivory lower block;
- centred white primary Chiramel & Co logo;
- small gold `FIRM PROFILE` identifier;
- thin realistic metallic-gold inlay positioned inside the graphite section;
- prominent serif title, `Intellectual Property Practice`;
- clickable `chiramelco.com` link above `NEW DELHI, INDIA`.

This direction replaced darker and more object-heavy concepts because it felt more contemporary, controlled and aligned with the website's black, ivory and gold visual language.

Key cover texture asset:

```text
work/company-profile/cover-options/cover-texture-graphite-leather-v1.jpg
```

Primary centred logo used on the cover:

```text
public/images/herologo.png
```

## Content and Image Decisions

Page 3 uses counsel portraits with consistent square framing. The final portrait supplied for Mr Jos Chiramel is:

```text
public/images/Jos Chiramel.png
```

Christine Chiramel's portrait remains:

```text
public/images/Christine Chiramel.jpeg
```

Page 5 includes:

- the IP Desk address and direct contact details;
- a clickable link to <https://chiramelco.com/intellectual-property/>;
- a scannable and clickable WhatsApp QR linking to <https://wa.me/919810928556>;
- Head Office details;
- a final centred clickable <https://chiramelco.com> link.

The QR code is generated as vector PDF content in the builder rather than imported from the site's thin-stroke SVG. This matters: the original SVG did not remain reliably scannable after PDF rasterisation, while the generated vector QR was confirmed to decode from the rendered PDF page.

## Editable Source and Build Workflow

The current five-page PDF builder is:

```text
work/company-profile/build_ip_five_page_profile_pdf.py
```

It uses ReportLab and PIL to construct the PDF deterministically, including live hyperlink annotations and the vector WhatsApp QR. Its output filename is intentionally the publication filename:

```text
deliverables/company-profile/Chiramel-Co-IP-Profile.pdf
```

Typical rebuild command:

```bash
/Users/nithinkdavid/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 work/company-profile/build_ip_five_page_profile_pdf.py
```

After accepting a regenerated PDF, place the publication copy in the public static source for future website builds:

```bash
cp deliverables/company-profile/Chiramel-Co-IP-Profile.pdf public/Chiramel-Co-IP-Profile.pdf
npm run build
```

Generated/rendered review files may be found under:

```text
work/company-profile/five-page-rendered/
```

## Verification Already Performed

The final five-page layout was rendered to page images and visually checked before completion. The following behaviors were also validated in the generated PDF:

- five-page page count;
- new Jos Chiramel portrait placement;
- clickable cover `chiramelco.com` URL;
- clickable last-page `chiramelco.com` URL;
- clickable IP practice URL, `https://chiramelco.com/intellectual-property/`;
- clickable WhatsApp QR destination, `https://wa.me/919810928556`;
- QR scanability from a rasterised PDF page.

The live `/profile-ip` route was verified after publication on 24 May 2026 and was serving a browser-displayable PDF successfully.

## Historical and Disposable Artifacts

The workspace also contains earlier drafts and cover explorations:

```text
deliverables/company-profile/Chiramel-Co-Intellectual-Property-Profile.pdf
deliverables/company-profile/cover-options/
work/company-profile/build_cover_options.py
work/company-profile/build_ip_profile_pdf.py
```

These are useful for design history but are not the publication source. Do not accidentally serve one of these in place of `Chiramel-Co-IP-Profile.pdf`.

A prior targeted ZIP named:

```text
chiramelco-profile-ip-upload.zip
```

was created when forced download behavior was being considered. It contains an `.htaccess` snapshot that may force download and should not be reused for the final in-browser display behavior without rebuilding the package.

## Future Changes

The user briefly considered creating an additional screen-optimised distribution PDF. This optimisation task was started only at the assessment stage and was not completed in the local source workflow. The live file appears already smaller than the local publication-quality master; confirm the desired quality and target file size before replacing it.

For future profile edits:

1. Modify `work/company-profile/build_ip_five_page_profile_pdf.py` or approved image assets.
2. Rebuild the PDF to the canonical filename.
3. Render and visually inspect all five pages.
4. Recheck hyperlinks and WhatsApp QR decoding.
5. Decide explicitly whether to publish the larger master or a separately optimised web copy.
6. Retain the browser-display `/profile-ip` behavior unless instructed otherwise.

## Current Baseline

The IP firm profile is complete as a five-page branded PDF, published at `/profile-ip`, displayed inline in the browser, and connected back into the website through clickable firm and IP practice links. The next meaningful work on this asset should be an intentional content revision or a controlled web-compression pass, not further exploratory cover design.
