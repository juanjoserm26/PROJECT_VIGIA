import { demoVideos } from '@/lib/demo-videos';

export type MonitorCamera = {
  id: string;
  label: string;
  location: string;
  videoSrc: string;
};

export const monitorCameras: MonitorCamera[] = demoVideos.map((v, i) => ({
  id: `cam-${v.id}`,
  label: `Cámara ${i + 1}`,
  location: v.title,
  videoSrc: v.videoSrc ?? '',
}));
