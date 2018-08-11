package com.tindung.jhip.repository;

import com.tindung.jhip.domain.VayLai;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

/**
 * Spring Data JPA repository for the VayLai entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VayLaiRepository extends JpaRepository<VayLai, Long> {

    @Query(value = "select b from VayLai b inner join b.hopdongvl h inner join h.cuaHang c where c.id =:idcuahang")
    public List<VayLai> findAllByCuaHang(@Param(value = "idcuahang") Long cuaHangId);

    @Query(value = "select b from VayLai b inner join b.hopdongvl h  where h.id =:idhopdong")
    public VayLai findByHopDong(@Param(value = "idhopdong") Long hopdongId);

//    @Query(value = "select b from VayLai b inner join b.hopdongvl h inner join h.khachHang c where c.id =:idkhachhang")
//    public List<VayLai> findAllByKhachHang(@Param(value = "idkhachhang") Long khachHangId);
    @Query("select k from VayLai k inner join k.hopdongvl h inner join h.khachHang j inner join h.cuaHang c where c.id =:id and h.mahopdong like :key or  j.ten like :key or j.cmnd like :key ")
    public List<VayLai> findByNameOrCMND(@Param("key") String key, @Param("id") Long cuaHangid);

    @Query(value = "select b from VayLai b  inner join b.hopdongvl h inner join h.cuaHang c  where h.ngaytao between  ?1 and ?2 and c.id =?3 ")
    List<VayLai> baocao(ZonedDateTime start, ZonedDateTime end, Long cuahangid);

    @Query(value = "select b from VayLai b  inner join b.hopdongvl h inner join h.cuaHang c inner join h.nhanVien n where h.ngaytao between  ?1 and ?2 and c.id =?3 and n.id=?4")
    List<VayLai> baocaoNV(ZonedDateTime start, ZonedDateTime end, Long cuahangid, Long nhanVienid);
}
