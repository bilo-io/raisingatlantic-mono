import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { useTheme } from "../../theme/useTheme";

type Props = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  scrollable?: boolean;
  onDismiss?: () => void;
};

export type BottomSheetRef = BottomSheetModal;

export const BottomSheet = forwardRef<BottomSheetModal, Props>(function BottomSheet(
  { children, snapPoints, scrollable = true, onDismiss },
  ref,
) {
  const { tokens } = useTheme();
  const points = useMemo(() => snapPoints ?? ["60%", "90%"], [snapPoints]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const Container = scrollable ? BottomSheetScrollView : BottomSheetView;

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={points}
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: tokens.card }}
      handleIndicatorStyle={{ backgroundColor: tokens.mutedForeground }}
    >
      <Container
        style={{ flex: 1 }}
        contentContainerStyle={
          scrollable ? { padding: 20, paddingBottom: 40 } : { flex: 1, padding: 20 }
        }
      >
        {children}
      </Container>
    </BottomSheetModal>
  );
});
