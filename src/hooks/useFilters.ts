import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useTransition } from "react";
import { FaMale, FaFemale } from "react-icons/fa";
import useFilterStore from "./useFilterStore";
import { Selection } from "@nextui-org/react";
import usePaginationStore from "./usePaginationStore";

export const useFilters = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { filters, setFilters } = useFilterStore();
  const pageNumber = usePaginationStore((state) => state.pagination.pageNumber);
  const pageSize = usePaginationStore((state) => state.pagination.pageSize);
  const setPage = usePaginationStore((state) => state.setPage);
  const totalCount = usePaginationStore((state) => state.pagination.totalCount);

  const { ageRange, gender, orderBy, withPhoto } = filters;

  useEffect(() => {
    if (gender || ageRange || orderBy || withPhoto) {
      setPage(1);
    }
  }, [gender, ageRange, orderBy, withPhoto, setPage]);

  useEffect(() => {
    startTransition(() => {
      const searchParamas = new URLSearchParams();

      if (gender) searchParamas.set("gender", gender.join(","));
      if (ageRange) searchParamas.set("ageRange", ageRange.toString());
      if (orderBy) searchParamas.set("orderBy", orderBy);
      if (pageSize) searchParamas.set("pageSize", pageSize.toString());
      if (pageNumber) searchParamas.set("pageNumber", pageNumber.toString());
      searchParamas.set("withPhoto", withPhoto.toString());
      router.replace(`${pathname}?${searchParamas}`);
    });
  }, [
    ageRange,
    orderBy,
    gender,
    router,
    pathname,
    pageNumber,
    pageSize,
    withPhoto,
  ]);

  const orderByList = [
    { label: "Last Active", value: "updated" },
    {
      label: "Newest Member",
      value: "created",
    },
  ];

  const genderList = [
    { value: "male", icon: FaMale },
    { value: "female", icon: FaFemale },
  ];

  const handleAgeSelect = (value: number[]) => {
    setFilters("ageRange", value);
  };

  const handleOrderSelect = (value: Selection) => {
    if (value instanceof Set) {
      setFilters("orderBy", value.values().next().value);
    }
  };

  const handleGenderSelect = (value: string) => {
    if (gender.includes(value))
      setFilters(
        "gender",
        gender.filter((g) => g !== value)
      );
    else setFilters("gender", [...gender, value]);
  };

  const handleWithPhotoToggle = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters("withPhoto", e.target.checked);
  };

  return {
    orderByList,
    genderList,
    selectAge: handleAgeSelect,
    selectGender: handleGenderSelect,
    selectOrder: handleOrderSelect,
    selectWithPhoto: handleWithPhotoToggle,
    filters,
    isPending,
    totalCount,
  };
};
