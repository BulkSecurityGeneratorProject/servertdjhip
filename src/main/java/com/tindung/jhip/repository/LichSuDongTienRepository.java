package com.tindung.jhip.repository;

import com.tindung.jhip.domain.LichSuDongTien;
import com.tindung.jhip.domain.enumeration.DONGTIEN;
import com.tindung.jhip.domain.enumeration.LOAIHOPDONG;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

/**
 * Spring Data JPA repository for the LichSuDongTien entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LichSuDongTienRepository extends JpaRepository<LichSuDongTien, Long> {

    @Query(value = "select l from LichSuDongTien l inner join l.hopDong h where h.id =:idhopdong")
    List<LichSuDongTien> findByHopDong(@Param(value = "idhopdong") long idhopdong);

    @Query(value = "select l from LichSuDongTien l inner join l.hopDong h inner join h.cuaHang c where l.ngaygiaodich between  ?3 and ?4 and l.trangthai=?1 and  h.loaihopdong =?2 and c.id =?5 order by l.ngaygiaodich ")
    List<LichSuDongTien> baocao(DONGTIEN dongtien, LOAIHOPDONG loaihopdong, ZonedDateTime start, ZonedDateTime end, Long cuaHangid);

    @Query(value = "select case when count(l) >0 then true else false end from LichSuDongTien l inner join l.hopDong h where h.id =:idhopdong and l.ngayketthuc < now() ")
    boolean kiemtra(@Param(value = "idhopdong") long idhopdong);

}
