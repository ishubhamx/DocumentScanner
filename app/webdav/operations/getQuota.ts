import { prepareRequestOptions, request } from '../request';
import { handleResponseCode, processResponsePayload } from '../response';
import { parseXML } from '../tools/dav';
import { parseQuota } from '../tools/quota';
import { DiskQuota, GetQuotaOptions, ResponseDataDetailed, WebDAVClientContext } from '../types';
import { path } from '@nativescript/core';

export async function getQuota(context: WebDAVClientContext, options: GetQuotaOptions = {}): Promise<DiskQuota | null | ResponseDataDetailed<DiskQuota | null>> {
    const pathStr = options.path || '/';
    const requestOptions = prepareRequestOptions(
        {
            url: path.join(context.remoteURL, pathStr),
            method: 'PROPFIND' as any,
            headers: {
                Accept: 'text/plain,application/xml',
                Depth: '0'
            }
        },
        context,
        options
    );
    const response = await request(requestOptions);
    await handleResponseCode(context, response);
    const responseData = await response.content.toStringAsync();
    const result = await parseXML(responseData);
    const quota = parseQuota(result);
    return processResponsePayload(response, quota, options.details);
}