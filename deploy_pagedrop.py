import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

ZIP_PATH = Path(__file__).parent / "site.zip"
API_URL = "https://pagedrop.dev/api/v1/sites"


def deploy() -> None:
    if not ZIP_PATH.exists():
        raise SystemExit(f"Missing {ZIP_PATH}")

    data = ZIP_PATH.read_bytes()
    boundary = "----CursorDeployBoundary"
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="site.zip"\r\n'
        f"Content-Type: application/zip\r\n\r\n"
    ).encode("utf-8") + data + f"\r\n--{boundary}--\r\n".encode("utf-8")

    request = urllib.request.Request(API_URL, data=body, method="POST")
    request.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")

    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        print(error.read().decode("utf-8", errors="replace"))
        raise SystemExit(error.code) from error

    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    deploy()
