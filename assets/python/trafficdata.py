import sys
import json
import pandas as pd

if __name__ == "__main__":
  traffic_df = pd.read_csv(sys.argv[1], delimiter = ';')
  j = sys.argv[2]

  for i in range(24) :
    t = traffic_df[traffic_df.City == sys.argv[2]]
    av_df1 = t[t.hours == int(i)]

    av_car_num = av_df1['CAR'].mean()
    av_bus_num = av_df1['BUS'].mean()
    av_lgv_num = av_df1['LGV'].mean()
    av_h2_num = av_df1['HGVR2'].mean()
    av_h3_num = av_df1['HGVR3'].mean()
    av_h4_num = av_df1['HGVR4'].mean()
    av_v3_num = av_df1['HGVA3'].mean()
    av_v5_num = av_df1['HGVA5'].mean()
    av_v6_num = av_df1['HGVA6'].mean()
    av_hgv_num = av_df1['HGV'].mean()
    av_amv_num = av_df1['AMV'].mean()

    av_veh_sum = (av_car_num + av_bus_num + av_lgv_num + av_h2_num + av_h3_num + av_h4_num + av_v3_num + av_v5_num + av_v6_num + av_hgv_num + av_amv_num)//11

    print(json.dumps(av_veh_sum))
