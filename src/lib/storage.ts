import "server-only";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { generateSafeStorageKey, resolveStoragePath, type StorageVisibility } from "@/lib/storage-keys";

export type { StorageVisibility } from "@/lib/storage-keys";
export type UploadInput = { bytes: Uint8Array; originalName: string; mimeType: string; folder: string; visibility: StorageVisibility };
export type StoredFile = { key: string; url: string; size: number };
const localRoot=path.resolve(process.cwd(),process.env.LOCAL_STORAGE_PATH||".storage");
export { generateSafeStorageKey };
export function resolveLocalStoragePath(key:string):string{return resolveStoragePath(localRoot,key);}
const provider=()=>process.env.STORAGE_PROVIDER?.toLowerCase()==="s3"?"s3":"local";
function s3Config(){const bucket=process.env.S3_BUCKET;const region=process.env.S3_REGION;const accessKeyId=process.env.S3_ACCESS_KEY_ID;const secretAccessKey=process.env.S3_SECRET_ACCESS_KEY;if(!bucket||!region||!accessKeyId||!secretAccessKey)throw new Error("S3 storage is not fully configured.");return{bucket,client:new S3Client({region,endpoint:process.env.S3_ENDPOINT||undefined,forcePathStyle:Boolean(process.env.S3_ENDPOINT),credentials:{accessKeyId,secretAccessKey}})};}
export async function uploadFile(input:UploadInput):Promise<StoredFile>{const key=generateSafeStorageKey(input.folder,input.originalName,input.visibility);if(provider()==="s3"){const{bucket,client}=s3Config();await client.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:input.bytes,ContentType:input.mimeType}));return{key,url:getPublicFileUrl(key),size:input.bytes.byteLength};}const target=resolveLocalStoragePath(key);await mkdir(path.dirname(target),{recursive:true});await writeFile(target,input.bytes);return{key,url:getPublicFileUrl(key),size:input.bytes.byteLength};}
export async function deleteFile(key:string):Promise<void>{if(provider()==="s3"){const{bucket,client}=s3Config();await client.send(new DeleteObjectCommand({Bucket:bucket,Key:key}));return;}await rm(resolveLocalStoragePath(key),{force:true});}
export async function fileExists(key:string):Promise<boolean>{try{if(provider()==="s3"){const{bucket,client}=s3Config();await client.send(new HeadObjectCommand({Bucket:bucket,Key:key}));}else await stat(resolveLocalStoragePath(key));return true;}catch{return false;}}
export function getPublicFileUrl(key:string):string{if(!key.startsWith("public/"))return`/api/admin/files/${encodeURIComponent(key)}`;if(provider()==="s3"){const base=process.env.S3_PUBLIC_URL;if(!base)throw new Error("S3_PUBLIC_URL is required for public assets.");return`${base.replace(/\/$/,"")}/${key}`;}return`/api/files/${key.split("/").map(encodeURIComponent).join("/")}`;}
export async function getStoredFile(key:string):Promise<{bytes:Uint8Array;contentType?:string}>{if(provider()==="s3"){const{bucket,client}=s3Config();const result=await client.send(new GetObjectCommand({Bucket:bucket,Key:key}));if(!result.Body)throw new Error("Stored file is empty.");return{bytes:await result.Body.transformToByteArray(),contentType:result.ContentType};}return{bytes:await readFile(resolveLocalStoragePath(key))};}
