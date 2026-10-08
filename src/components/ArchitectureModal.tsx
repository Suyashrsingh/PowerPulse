import React, { useState } from 'react';
import { X, Network } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'esp32' | 'lambda' | 'dynamodb'>('pipeline');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="neu-card w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-300/40 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-lime-500">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-main font-mono tracking-wide">
                AWS TELEMETRY PIPELINE ARCHITECTURE
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neu-btn p-2 text-sub hover:text-main"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 pt-4 border-b border-slate-300/40 dark:border-slate-800 flex items-center gap-2 font-mono overflow-x-auto max-w-full scrollbar-none py-1">
          {(['pipeline', 'esp32', 'lambda', 'dynamodb'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 sm:px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition whitespace-nowrap flex-shrink-0 ${
                activeTab === tab
                  ? 'neu-btn-primary text-slate-950 shadow-md'
                  : 'neu-btn text-main'
              }`}
            >
              {tab === 'pipeline'
                ? 'Pipeline Flow'
                : tab === 'esp32'
                ? 'ESP32 Payload'
                : tab === 'lambda'
                ? 'AWS Lambda Code'
                : 'DynamoDB Schema'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-sub">
          
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="neu-card p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-black text-lime-600 dark:text-lime-400 uppercase">Step 1: Sensor</span>
                  <h4 className="font-black text-main text-xs mt-1">PZEM-004T v3.0</h4>
                  <p className="text-[10px] text-sub mt-1">UART Modbus-RTU meter</p>
                </div>

                <div className="neu-card p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-black text-lime-600 dark:text-lime-400 uppercase">Step 2: MCU</span>
                  <h4 className="font-black text-main text-xs mt-1">ESP32 Wi-Fi</h4>
                  <p className="text-[10px] text-sub mt-1">TLS MQTT publisher (8883)</p>
                </div>

                <div className="neu-card p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-black text-lime-600 dark:text-lime-400 uppercase">Step 3: Cloud</span>
                  <h4 className="font-black text-main text-xs mt-1">AWS IoT Core</h4>
                  <p className="text-[10px] text-sub mt-1">Topic smartenergymeter/pub</p>
                </div>

                <div className="neu-card p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-black text-lime-600 dark:text-lime-400 uppercase">Step 4: Storage</span>
                  <h4 className="font-black text-main text-xs mt-1">DynamoDB & Lambda</h4>
                  <p className="text-[10px] text-sub mt-1">Time-series store & SNS rule</p>
                </div>

                <div className="neu-card p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-black text-lime-600 dark:text-lime-400 uppercase">Step 5: UI</span>
                  <h4 className="font-black text-main text-xs mt-1">React Dashboard</h4>
                  <p className="text-[10px] text-sub mt-1">3D Neumorphic telemetry UI</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'esp32' && (
            <pre className="neu-inset p-5 text-lime-600 dark:text-lime-400 font-mono text-xs overflow-x-auto rounded-xl font-bold">
{`{
  "device_id": "SmartEnergyMeter01",
  "timestamp": "2026-09-24T22:07:42Z",
  "voltage": 230.4,
  "current": 2.31,
  "power": 532.2,
  "energy": 1.284,
  "frequency": 50.0,
  "power_factor": 0.94
}`}
            </pre>
          )}

          {activeTab === 'lambda' && (
            <pre className="neu-inset p-5 text-lime-600 dark:text-lime-400 font-mono text-xs overflow-x-auto rounded-xl font-bold">
{`import json
import boto3

sns = boto3.client("sns")

SNS_TOPIC_ARN = "arn:aws:sns:ap-south-1:645822828113:SmartEnergyAlerts"

def lambda_handler(event, context):
    print("Received:", json.dumps(event))

    power = float(event.get("power", 0))
    device_id = event.get("device_id", "Unknown")

    if power > 3000:
        subject = "CRITICAL: High Power Consumption"
        message = (
            f"Device: {device_id}\\n"
            f"Power: {power} W\\n\\n"
            "Critical power threshold exceeded!"
        )
    elif power > 2000:
        subject = "WARNING: High Power Consumption"
        message = (
            f"Device: {device_id}\\n"
            f"Power: {power} W\\n\\n"
            "Warning power threshold exceeded."
        )
    else:
        return {"statusCode": 200, "body": "Power is normal"}

    sns.publish(
        TopicArn=SNS_TOPIC_ARN,
        Subject=subject,
        Message=message
    )

    return {"statusCode": 200, "body": "Alert sent"}`}
            </pre>
          )}

          {activeTab === 'dynamodb' && (
            <pre className="neu-inset p-5 text-lime-600 dark:text-lime-400 font-mono text-xs overflow-x-auto rounded-xl font-bold">
{`Partition Key: device_id (String) -> "SmartEnergyMeter01"
Sort Key:      timestamp (String) -> "2026-09-24T22:07:42Z"

Attributes:
  - voltage      (Number): 230.4
  - current      (Number): 2.31
  - power        (Number): 532.2
  - energy       (Number): 1.284
  - frequency    (Number): 50.0
  - power_factor (Number): 0.94`}
            </pre>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-300/40 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="neu-btn-primary px-5 py-2 text-xs font-black font-mono text-slate-950"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ArchitectureModal;
