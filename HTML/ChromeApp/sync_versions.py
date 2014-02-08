import json


def sync_versions(main_data, mobile_data):
    """Set versionCode and CFBundleVersion to meet version in manifest.json."""
    version = main_data['version']
    mobile_data['versionCode'] = int(version)
    # Statically setting '{version}.1.1' so Oplop seems stable. =)
    mobile_data['CFBundleVersion'] = version + '.1.1'
    return mobile_data


if __name__ == '__main__':
    import sys
    if len(sys.argv) != 3:
        raise ValueError('expect only 2 arguments')
    main_path = sys.argv[1]
    mobile_path = sys.argv[2]
    with open(main_path) as file:
        main_data = json.load(file)
    with open(mobile_path) as file:
        mobile_data = json.load(file)
    mobile_data = sync_versions(main_data, mobile_data)
    with open(mobile_path, 'w') as file:
        json.dump(mobile_data, file, indent=2)
        file.write('\n')
