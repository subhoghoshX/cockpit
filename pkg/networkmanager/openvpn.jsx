import React, { useContext, useState } from 'react';
import { Name, NetworkModal, dialogSave } from "./dialogs-common";
import { FileUpload } from '@patternfly/react-core/dist/esm/components/FileUpload/index.js';
import { FormGroup } from '@patternfly/react-core/dist/esm/components/Form/index.js';
import { TextInput } from '@patternfly/react-core/dist/esm/components/TextInput/index.js';
import cockpit from 'cockpit';
import { ModelContext } from './model-context';
import { useDialogs } from 'dialogs.jsx';

const _ = cockpit.gettext;

/*******************************************
    * Default Certs for testing purposes only
********************************************/
const defaultCACert = `
-----BEGIN CERTIFICATE-----
MIIDRDCCAiygAwIBAgIJAPRJm0V+RAQkMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAMMEENsb3VkVlBOIFByb2QgQ0EwHhcNMTkxMDE2MTgwNDQ3WhcNNDkxMDA4MTgw
NDQ3WjAbMRkwFwYDVQQDDBBDbG91ZFZQTiBQcm9kIENBMIIBIjANBgkqhkiG9w0B
AQEFAAOCAQ8AMIIBCgKCAQEAvbodWcvyngHYGLVvLHTy9hLFIqrkxWQqi7gnC4RO
Nz0VLzr9WckNN+kE7IrI9qbWL+F/4g5FKNOAayZf1Xc6YU2kV2JkXiScfGexsbFN
rG+CFnphEdk2gJmDEFNxtDmxFVaTv7QCgtcijYEGMADW07sFfvDX0fjeKCTatSe6
rVrQ0jCKsKoOtTiE2IvIlg41cvM7N7Pj/WVFs3Rwjbctd/i+bJ9A4j+G5gCR13KE
Y48fCmkuvptaXZ8JyKoisoX46XTqDEQqBSG3exT6txlgsdqd+obp+CtuhPQQAVH4
f04bM/wNDbFDWVPl0AbdKj9EmdBPIroLWi4VYtJeu4vjMQIDAQABo4GKMIGHMB0G
A1UdDgQWBBTZQ8jn1xwiL3mg+FhSrS5WLh7bKDBLBgNVHSMERDBCgBTZQ8jn1xwi
L3mg+FhSrS5WLh7bKKEfpB0wGzEZMBcGA1UEAwwQQ2xvdWRWUE4gUHJvZCBDQYIJ
APRJm0V+RAQkMAwGA1UdEwQFMAMBAf8wCwYDVR0PBAQDAgEGMA0GCSqGSIb3DQEB
CwUAA4IBAQBCk7zsTsiC0qEtwAfN1yo6VgbTBJf/rBDtoIjofVNDtpjaDZBA3/PT
v+aJJEHSYaP7xNX91cP32Un09aG9BDT4OuLhYO3mOx+ghmFCCt5NhTvbT4gqmWfi
MNaB8Z89gSaeuduD46btNjk+SeIWKBDrZlq0tJ9zexi6OEkre/XA7lssDTtE4GaC
5xKtug1TxrzRziWv2OA14RLGq8n0Hhk40xdhrvE+bhWAUsd2fbfNxTzwhsfQrBH7
K4FWB1sRavCTokSSJ7OX4R3w8QIn7Ziyqzu9JLJ5sy0EhVQxkQpuoW3BwmDVdXLS
d4rhWO4aNE5qqE6lq5AOJ1riv7BrZ4jj
-----END CERTIFICATE-----
`;
const defaultUserCert = `
-----BEGIN CERTIFICATE-----
MIIDSjCCAjKgAwIBAgIDD7jGMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNVBAMMEENs
b3VkVlBOIFByb2QgQ0EwHhcNMjMwOTA0MDUwNjUyWhcNNDgwOTA0MDUwNjUyWjBp
MWcwZQYDVQQDDF5zdWJob2dob3NoL2Nvbm5lY3Rvci80ZTgzYWNiOC01ZWQxLTQx
OTUtYjk1My05MzI4MmNhZTc0YTlfNDEyNTdmNDYtMWU2MS00Y2M2LTg0NWYtMjcy
ZTdkMjBiNzhhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyHQKtIKD
9zO7nsXk1EuIampauY6GilT0iuLnmiZ67iQ8G0Cx7bl0qxLtNDt6hAGvy7dGCxV0
NKFmnCmHiDe5sKl9lO6mmFL68RvvfWvWoGUOACbUhRjoxn5u8tAKE4gcT1GLilH6
ACvloDxl68uSTAlPrLZnFYmx9ksomTeXESjYoHmQ92PbOS6w7oeVQxr/W+rxAeHX
tWGMj/onqvGHvr2XHCgcj9NnrA2f6JPZmxMSVmxkT0K8U6DnSwrYbpkDYtR0OQ1k
oSQc/RBxi1txssVbkDG/4tCSYBfYLqzh1XWXgUlRf56FBJZV5LLoPxqZHoEEeEEH
UxNcyHMxsxRglQIDAQABo0kwRzAOBgNVHQ8BAf8EBAMCAoQwEwYDVR0lBAwwCgYI
KwYBBQUHAwIwCQYDVR0TBAIwADAVBgNVHREEDjAMgQpzdWJob2dob3NoMA0GCSqG
SIb3DQEBCwUAA4IBAQBAtHLliPlhLVc/sAW3fytRk8+wzufe+anFLZKpo0qW4ZLd
jfgJoYcjs21Nqaxj0Pb+DuO2sKNPT2UeUPBPpas/0141GOsVllWIocGImQNHSPwr
WAZXD+3P/LEYkXqDa8t1qagSilcI6xuOf+m12X8ipQuuYri1w8sKOfFGaqKsAewq
fkjQck0CmHNthZ5w5XoI9xKzvFd41+Hq9p9ZRTQiCFm8z5ivCcYQLsMQgjgnFH83
T4PFkVLVVOdU6s3vIQpHyt5g/R7YFY/hSaefmOBXb66YJYC8gxpQH+zmDO1V4EtV
TS5h1VFVBCy629I4GFzsh3Rq6dVEq02gUd3HadTX
-----END CERTIFICATE-----
`;
const defaultPrivateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAyHQKtIKD9zO7nsXk1EuIampauY6GilT0iuLnmiZ67iQ8G0Cx
7bl0qxLtNDt6hAGvy7dGCxV0NKFmnCmHiDe5sKl9lO6mmFL68RvvfWvWoGUOACbU
hRjoxn5u8tAKE4gcT1GLilH6ACvloDxl68uSTAlPrLZnFYmx9ksomTeXESjYoHmQ
92PbOS6w7oeVQxr/W+rxAeHXtWGMj/onqvGHvr2XHCgcj9NnrA2f6JPZmxMSVmxk
T0K8U6DnSwrYbpkDYtR0OQ1koSQc/RBxi1txssVbkDG/4tCSYBfYLqzh1XWXgUlR
f56FBJZV5LLoPxqZHoEEeEEHUxNcyHMxsxRglQIDAQABAoIBAC7BEjYkMw+Xm21f
Dw6NR5Y6lEqveaYORrOWVRrZWtbs0LAymM2v8gxs77K9JMhhdFV5u/ad3GriMoK+
FQSqqr8P6WCxgV4KDMnsECIa4waqS2expuQceT7DArHT4GXJ24CMrpVmpX8gvgBv
1f33j3n4ugK40LZvVXjy8tc55hx0FtOaD6ORHJw+ZLXZa1QMhoOpPAgR9gJp3x24
nw6swXP+HVO9v7oCdeoqYoyGmgCc4z7kV2vzgx2Bk1+WHFz6MVGVzf7o3/9YEJoD
YPAcclodYw7EamemoeRoWQDzusBmjhlgNZz4LSoyCCUo+eNh2KyrkyxJe04I3VFC
1dc9k0ECgYEA5bMsRljMALcX3dgl4hzgoRxXdX7/mafttGoU68wuQvH+w6EYwDt+
6sgjL2kMKW4SJY/EPZ3nrSTvrP3cdid3kED8N5z4aP9wGVAG0VP7Zs2P7m0CG1rW
ja3yQA3cF1eqSLuYdps0kVLs+wvSsEXEqeqBWh83JKJqs1B2LxJRtmkCgYEA32ec
FW+nj0Gg6ECEC69Kb6mXTlarvsQzm/+U96/Oa5uMh0hdT85y1dd79kLAWjVDC7qS
eY3EyMJtBI54k1RReebgDExiLEu4ozW61JO6+REXVBSxFIC5cr33ajf7TPwMHJCY
uOir1XEqCSrI/UBzClM+vRLbM2MMfK8myw8aC00CgYEAuGRnDGnICmLws9QKRUOt
R2g7BUVX5n+aIJRwCwIzuOYO//hYqCiar9rN9Ac+DhwgUSrh/BzAmIvoI1T/H5J7
NsAUOIi4GYHE+Wz2rB/g1xv5iQrVACShy8Zxi94UamCjgBOoRr49KtQJDVbmYT8A
qu5nvHMGj1Aam6vh09O+6NECgYEAjOMYaeRaNVvcD9vv6jaHqNe41eyOruWo7m5G
EdXLRc142C/ouNWnUfhs8qayC7GfMJxel02yljEW81Kt86uvHkNddCQPnYO7UyIl
Sr5HoZ8HqTzLV/S9/wCSMWhQkQI62SDPT31cMGUHb3SOADhO1GofHLnxhvyl+VO0
EUba09kCgYBY+kNL82pahxTAEweOtENFI0kKVrEHQIwc3+e+fTbEYRw3I0IPwK4I
c0Oyc/koVrfM4Y6cJqPvYr81P/vI0XXHx1py3n6o/Ha4UoxkLwx2DcdnrE7KOSuB
Oe26H4qMdEhX/561Wom42uC9arIbcLFtiCZXhZRk2fFtK+Bo3sL+HQ==
-----END RSA PRIVATE KEY-----
`;

/* *****************************************
({'connection': {'id': <'ubuntu_chicago_(il)'>, 'permissions': <@as []>}, 'vpn': {'data': <{'auth': 'SHA256', 'ca': '/home/subho/.cert/nm-openvpn/ubuntu_chicago_(il)-ca.pem', 'cert': '/home/subho/.cert/nm-openvpn/ubuntu_chicago_(il)-cert.pem', 'cipher': 'AES-256-CBC', 'connection-type': 'tls', 'dev': 'tun', 'key': '/home/subho/.cert/nm-openvpn/ubuntu_chicago_(il)-key.pem', 'push-peer-info': 'yes', 'remote': 'us-ord.gw.openvpn.com:1194:udp, us-ord.gw.openvpn.com:1194:udp, us-ord.gw.openvpn.com:443:tcp, us-ord.gw.openvpn.com:1194:udp, us-ord.gw.openvpn.com:1194:udp, us-ord.gw.openvpn.com:1194:udp, us-ord.gw.openvpn.com:1194:udp, us-ord.gw.openvpn.com:1194:udp', 'remote-cert-tls': 'server', 'ta': '/home/subho/.cert/nm-openvpn/ubuntu_chicago_(il)-tls-auth.pem', 'ta-dir': '1'}>, 'secrets': <@a{ss} {}>, 'service-type': <'org.freedesktop.NetworkManager.openvpn'>}, 'ipv4': {'address-data': <@aa{sv} []>, 'dns-search': <@as []>, 'method': <'auto'>, 'route-data': <@aa{sv} []>}},)
*/

export function OpenVPNDialog({ settings, connection, dev }) {
    const Dialogs = useDialogs;
    const idPrefix = "network-openvpn-settings";
    const model = useContext(ModelContext);

    const [iface, setIface] = useState(settings.connection.interface_name);
    const [remote, setRemote] = useState("");
    const [caCertVal, setCaCertVal] = useState(defaultCACert);
    const [userCertVal, setUserCertVal] = useState(defaultUserCert);
    const [userPrivateKey, setUserPrivateKey] = useState(defaultPrivateKey);
    const [dialogError, setDialogError] = useState("");

    function onSubmit() {
        function createSettingsObject() {
            return {
                ...settings,
                connection: {
                    ...settings.connection,
                    type: 'vpn',
                },
                vpn: {
                    data: {
                        auth: 'SHA256',
                        'cert-pass-flags': '0',
                        cipher: 'AES-256-CBC',
                        'connection-type': 'tls',
                        dev: 'tun',
                        'push-peer-info': 'yes',
                        'remote-cert-tls': 'server'
                    },
                    'service-type': 'org.freedesktop.NetworkManager.openvnp'
                }
            };
        }

        dialogSave({
            connection,
            dev,
            model,
            settings: createSettingsObject(),
            onClose: Dialogs.close,
            setDialogError,
        });
    }

    return (
        <NetworkModal
            title={!connection ? _("Add OpenVPN") : _("Edit OpenVPN settings")}
            isCreateDialog={!connection}
            onSubmit={onSubmit}
        >
            <Name idPrefix={idPrefix} iface={iface} setIface={setIface} />
            <FormGroup label={_("Remote")}>
                <TextInput value={remote} onChange={(_, val) => setRemote(val)} />
            </FormGroup>
            <FormGroup label={_("CA certificate")}>
                <FileUpload onFileInputChange={(_, file) => console.log('file => ', file)} type='text' onDataChange={(_, val) => setCaCertVal(val)} hideDefaultPreview />
            </FormGroup>
            <FormGroup label={_("User certificate")}>
                <FileUpload onFileInputChange={(_, file) => console.log('file => ', file)} type='text' onDataChange={(_, val) => setUserCertVal(val)} hideDefaultPreview />
            </FormGroup>
            <FormGroup label={_("User private key")}>
                <FileUpload onFileInputChange={(_, file) => console.log('file => ', file)} type='text' onDataChange={(_, val) => setUserPrivateKey(val)} hideDefaultPreview />
            </FormGroup>
        </NetworkModal>
    );
}

export function getOpenVPNGhostSettings({ newIfaceName }) {
    return {
        connection: {
            id: `con-${newIfaceName}`,
            interface_name: newIfaceName,
        }
    };
}
