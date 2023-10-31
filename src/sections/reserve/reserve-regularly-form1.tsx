// react
import { useCallback, useEffect, useState } from "react";
import styled from 'styled-components';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DesktopTimePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// hooks
// import { useBoolean } from 'src/hooks/use-boolean';
// components
import { useSettingsContext } from 'src/components/settings';
import { useForm } from 'react-hook-form';
import FormProvider , {
  RHFEditor,
  RHFSelect,
  RHFUpload,
  RHFSwitch,
  RHFSlider,
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
import dayjs, { Dayjs } from 'dayjs';
// api
import { GetSpace } from 'src/api/spaceApi';
import { useQuery } from 'react-query';

const DayButton = styled.button`
    width: 31px;
    height: 42px;
    border-radius: 7px;
    margin-right: 7px;
    border-width: 2px;
    background: white;
`;

// ———————————————————————————————————
export const defaultValues = {
  id: 1,
  startDate: '',
  endDate: '',
  week: '',
  startTime: '',
  endTime: '',
  headCount: 0,
  spaceId: 0,
};
interface ReserveForm1Props {
  handleRegularlyReserveInfo: (data: any) => void;
}

export default function ReserveRegularyForm1({ handleRegularlyReserveInfo }: ReserveForm1Props) {
    // const settings = useSettingsContext();

    const { data: spaces } = useQuery(
      ['GetSpace', GetSpace],
      () => GetSpace().then((response) => response.data),
      {
        onSuccess: (data) => {
          console.log('GetSpace', data);
        },
      }
    );
  
    const methods = useForm({
      defaultValues
    });
  
    const {
      // watch,
      // reset,
      // control,
      setValue,
      // handleSubmit,
      formState: { isSubmitting },
    } = methods;

    const [startDate, setstartDate] = useState<Dayjs | null>(dayjs());
    const [endDate, setendDate] = useState<Dayjs | null>(dayjs());
    const [week, setweek] = useState<string[]>([]);
    const [startTime, setstartTime] = useState(defaultValues.startTime);
    const [endTime, setendTime] = useState(defaultValues.endTime);
    const [headCount, setheadCount] = useState(0);
    // const [spaceId, setSpaceId] = useState('');

    // const handleHeadCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const numericValue = event.target.value.replace(/\D/g, ''); // 숫자만
    //   setheadCount(numericValue);
    //   handleNextClick();
    // };
    // const handleSpaceChange = (event: SelectChangeEvent) => {
    //   const value = event.target.value;
    //   setSpaceId(value);
    // };


    const handleNextClick = useCallback(() => {
      // const headCountNumber = parseInt(headCount, 10);
      // const spaceIdNumber = parseInt(spaceId, 10);
        const selectedData = {
            startDate,
            endDate,
            week,
            startTime,
            endTime,
            headCount,
            // spaceId: spaceIdNumber,
        };
        handleRegularlyReserveInfo(selectedData);
      }, [startDate, endDate, week, startTime, endTime, headCount, handleRegularlyReserveInfo]);
      
      useEffect(() => {
        handleNextClick();
      }, [handleNextClick]);


    const days: string[] = ['월', '화', '수', '목', '금', '토', '일'];
    const toggleDay = (day: string) => {
        if (week.includes(day)) {
          // 이미 선택된 경우, 선택 해제
          setweek(week.filter((d) => d !== day));
        } else {
          // 선택되지 않은 경우, 선택
          setweek([...week, day]);
        }
    };
  
    const toggleAllDays = () => {
      if (week.length === days.length) {
        // 모든 날짜가 선택된 경우, 모두 선택 해제
        setweek([]);
      } else {
        // 일부 또는 전혀 선택되지 않은 경우, 모두 선택
        setweek([...days]);
      }
    };

    return (
        <Box>
        <Typography variant="h4" color="primary" sx={{marginBottom: '20px'}}> 
          정기 예약 하기
        </Typography>
        <FormProvider methods={methods}>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ marginRight: '10px' }}>
              {/* <Typography variant="subtitle2">시작 일 *</Typography> */}
              <DemoContainer components={['DatePicker', 'DatePicker']} >
                <DatePicker
                  value={startDate}
                  onChange={(newValue) => {
                    setstartDate(newValue);
                  }}
                  sx={{ width: '200px'}}
                  label='시작 일'
                />
              </DemoContainer>
            </div>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div style={{ marginRight: '10px' }}>
                {/* <Typography variant="subtitle2">종료 일 *</Typography> */}
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                  <DatePicker
                    value={endDate}
                    onChange={(newValue) => {
                      setendDate(newValue);
                    }}
                    sx={{ width: '200px'}}
                    label='종료 일'
                  />
                </DemoContainer>
              </div>
            </LocalizationProvider>
          </div>
          <div style={{ marginRight: '10px', marginTop: '12px'}}>
            {/* <Typography variant="subtitle2" sx={{ margin: '0 0 12px 0' }}>요일 *</Typography> */}
            <DayButton type="button" onClick={toggleAllDays} style={{ width: '40px' }}>
                전체
            </DayButton>
            {days.map((day) => (
                <DayButton
                key={day}
                onClick={() => {
                  toggleDay(day);
                }}
                style={{
                    background: week.includes(day) ? '#FFECF6' : 'white',
                }}
                type="button"
                >
                {day}
                </DayButton>
            ))}
          </div>
          {/* </div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}> */}
          <div style={{ marginRight: '10px' }}>
            {/* <Typography variant="subtitle2">이용 시간 *</Typography> */}
            <DesktopTimePicker
                label="예약 시작 시간"
                value={methods.watch('startTime')}
                onChange={(newValue) => {
                    if (newValue !== null) {
                    const dateObject = new Date(newValue);
                    const formattedTime = dateObject.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    });
                    // setValue('availableStart', formattedTime);
                    setstartTime(formattedTime);
                    // console.log(formattedTime);
                    }
                }}
                sx={{ margin: '8.5px 10px 0 0', width: '200px'}}
            />
            <DesktopTimePicker
                label="예약 끝 시간"
                value={methods.watch('endTime')}
                onChange={(newValue) => {
                    if (newValue !== null) {
                    const dateObject = new Date(newValue);
                    const formattedTime = dateObject.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    });
                    // setValue('availableEnd', formattedTime);
                    setendTime(formattedTime);
                    // console.log(formattedTime);
                    }
                }}
                sx={{ margin: '8.5px 10px 0 0', width: '200px'}}
                />
          </div>
          <div style={{ marginRight: '10px' }}>
            {/* <Typography variant="subtitle2">사용 인원 *</Typography> */}
            <RHFTextField 
              name="headCount" 
              label="사용 인원을 입력해주세요." 
              sx={{ margin: '8.5px 10px 0 0', width: '200px'}} 
              type="number"
              onChange={(newValue) => {
                const numericValue = parseFloat(newValue.target.value);
                setheadCount(numericValue);
              }}
              value={headCount}
            />
          </div>
        {/* <FormControl fullWidth>
          <InputLabel>수용 인원</InputLabel>
          <Select
            // labelId="demo-simple-select-label"
            // id="demo-simple-select"
            name="headCount"
            label="headCount"
            onChange={handlePersonneleChange}
            sx={{ width: '280px'}}
          >
            <MenuItem value={10}>10명 이상</MenuItem>
            <MenuItem value={20}>20명 이상</MenuItem>
            <MenuItem value={30}>30명 이상</MenuItem>
          </Select>
        </FormControl> */}
            {/* <Box sx={{ minWidth: 120 }}>
            <Text>이용 공간 *</Text>
            <FormControl fullWidth>
            <InputLabel>이용 공간</InputLabel>
                <Select
                name="spaceId"
                label="spaceId"
                onChange={handleSpaceChange}
                sx={{ width: '280px'}}
                > 
                {spaces && spaces.map((space: any) => (
                <MenuItem key={space?.spaceId} value={space?.spaceId}>
                    {space?.name}
                </MenuItem>
                ))}
                </Select>
            </FormControl>
            </Box> */}
            {/* <div style={{ flexGrow: 0.5 }}>
              <Button onClick={handleNextClick} variant="contained" color="primary" disabled={isSubmitting} sx={{ marginTop: '40px' }}>
                장소 찾기
              </Button>
            </div> */}
        </div>
        </FormProvider>
      </Box>
    );
}